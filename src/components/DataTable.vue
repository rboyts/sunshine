<script lang="ts">
import Vue, { VNode } from 'vue';

const sum = (numbers: number[]) => numbers.reduce((s, v) => s + v, 0);

interface ISortState {
  key: string | null;
  reverse: boolean;
}

interface IDragState {
  dragColumnIndex: number;
  startX: number;
  curX: number;
  startScrollX: number;
  curScrollX: number;
  widths: number[];
}

interface IColumn {
  key: string;
  label: string;
  sortable: boolean;
}

interface IItem {
  [key: string]: any;
}

export default Vue.extend({
  name: 'data-table',

  props: {
    columns: Array as () => IColumn[],
    items: Array as () => IItem[],
    draggable: Boolean,
  },

  data() {
    return {
      sorting: {
        key: null,
        reverse: false,
      } as ISortState,
      drag: null as IDragState | null,
      lastDragged: null as number | null,
    };
  },

  computed: {
    thresholds(): number[] {
      if (!this.drag) return [];

      let { dragColumnIndex, widths } = this.drag;

      let res: number[] = [];
      let total = 0;

      widths.forEach((w, i) => {
        if (i !== dragColumnIndex) {
          res.push(total + w / 2);
          total += w;
        }
      });

      // Add sentinel value to simplify logic
      res.push(Number.MAX_VALUE);

      return res;
    },

    originalX(): number {
      if (!this.drag) return 0;
      let { dragColumnIndex, widths } = this.drag;
      return sum(widths.slice(0, dragColumnIndex));
    },

    currentOffsetX(): number {
      if (!this.drag) return 0;
      let { curX, startX, curScrollX, startScrollX } = this.drag;
      return curX - startX + curScrollX - startScrollX;
    },

    currentDropIndex(): number {
      if (!this.drag) return 0;

      let { startX, dragColumnIndex } = this.drag;
      if (startX === 0) return dragColumnIndex;

      let pos = this.originalX + this.currentOffsetX;
      return this.thresholds.findIndex(t => t > pos);
    },

    // How many pixels each column is shifted horizontally when dragging
    shiftValues(): number[] | null {
      if (!this.drag) return null;

      let { widths, dragColumnIndex } = this.drag;

      let dc = dragColumnIndex;
      let shift = widths[dc];
      let dropIndex = this.currentDropIndex;

      return widths.map((w, index) => {
        switch (true) {
          case (index === dc):
            return this.currentOffsetX;
          case (index < dc && index >= dropIndex):
            return shift;
          case (index > dc && index <= dropIndex):
            return -shift;
          default:
            return 0;
        }
      });
    },
  },

  methods: {
    onSort(event: MouseEvent, key: string) {
      if (this.sorting.key === key) {
        this.sorting.reverse = !this.sorting.reverse;
      } else {
        this.sorting.key = key;
        this.sorting.reverse = false;
      }

      const keyFunc = (item: IItem) => item[key];

      const sortFunc = (a: IItem, b: IItem) => {
        let keyA = keyFunc(a);
        let keyB = keyFunc(b);
        let v = this.sorting.reverse ? 1 : -1;

        switch (true) {
          case keyA < keyB:
            return v;
          case keyA > keyB:
            return -v;
          default:
            return 1;
        }
      };

      // XXX: Mutating props is perhaps not a good idea!

      this.items.sort(sortFunc);
    },

    onDrop(event: DragEvent) {
      event.preventDefault();

      if (!this.drag) return;

      let { dragColumnIndex, widths } = this.drag;

      let from = dragColumnIndex;
      let to = this.currentDropIndex;

      // XXX: Mutating props is perhaps not a good idea!
      if (from !== to) {
        const moved = this.columns.splice(from, 1);
        this.columns.splice(to, 0, ...moved);
      }

      // Need to be a little bit clever here, to get a smooth animation into the new place
      let offset = this.currentOffsetX;
      if (from < to) {
        offset = offset - sum(widths.slice(from + 1, to + 1));
      }
      if (from > to) {
        offset = offset + sum(widths.slice(to, from));
      }

      this.lastDragged = to;
      this.drag = {
        dragColumnIndex: to,
        startX: 0,
        curX: offset,
        startScrollX: 0,
        curScrollX: 0,
        widths,
      };
    },

    onDragEnd(event: DragEvent) {
      event.preventDefault();

      // Need to delay resetting the state until the current state is rendered,
      // for animations to be correct
      Vue.nextTick(() => {
        window.requestAnimationFrame(() => {
          if (this.drag)
            this.lastDragged = this.drag.dragColumnIndex;

          this.drag = null;
        });
      });
    },

    onDragStart(event: DragEvent, index: number) {
      let element = event.currentTarget as HTMLElement;
      if (element === null) return;

      this.clearSelection();

      let row = element.closest('tr');
      if (row === null) return;

      let viewport = element.closest('.data-table');
      if (viewport === null) return;

      let widths: number[] = [];
      for (let c of row.children) {
        widths.push((c as HTMLElement).offsetWidth);
      }

      this.lastDragged = null;
      this.drag = {
        dragColumnIndex: index,
        startX: event.clientX,
        curX: event.clientX,
        startScrollX: viewport.scrollLeft,
        curScrollX: viewport.scrollLeft,
        widths,
      };

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setDragImage(new Image(), 0, 0);
      }
    },

    onDragOver(event: DragEvent) {
      event.preventDefault();
    },

    onDrag(event: DragEvent) {
      event.preventDefault();

      if (!this.drag) return;
      if (event.clientX === 0) return;

      this.drag.curX = event.clientX;
    },

    onScroll(event: UIEvent) {
      if (!this.drag) return;

      let element = event.target as HTMLElement;
      if (element === null) return;

      this.drag.curScrollX = element.scrollLeft;
    },

    clearSelection() {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    },

    renderTable(): VNode {
      const h = this.$createElement;

      return h('table',
        [
          this.renderHeader(),
          this.renderBody(),
        ],
      );
    },

    renderHeader(): VNode {
      const h = this.$createElement;

      return h('thead', [
        h('tr',
          this.columns.map((column, index) => this.renderHeaderCell(column, index)),
        ),
      ]);
    },

    renderCell(tag: string, key: string, index: number, children: string | Array<string | VNode>) {
      const h = this.$createElement;

      return h(tag, {
        key,
        class: this.getColumnClass(index),
        style: this.getColumnStyle(index),
      }, children);
    },

    renderHeaderCell(column: IColumn, index: number): VNode {
      const h = this.$createElement;

      const children: Array<string | VNode> = [];

      children.push(column.label);

      if (column.sortable) {
        children.push(this.renderSortArrows(column.key));
      }

      // spacer
      children.push(h('span', {style: {flex: 1}}));

      if (this.draggable) {
        children.push(this.renderDragHandle(index));
      }

      let on: { [key: string]: any } = {};

      if (column.sortable) {
        on.click = (event: MouseEvent) => this.onSort(event, column.key);
      }

      return h('th', {
        key: column.key,
        class: {
          ...this.getColumnClass(index),
          sortable: column.sortable,
        },
        style: this.getColumnStyle(index),
        on,
      },
      [
        h('div', { class: 'th-flex' }, children),
      ]);
    },

    renderSortArrows(key: string): VNode {
      const h = this.$createElement;

      let { sorting } = this;

      let arrow = sorting.key === key ? sorting.reverse ? '\u2193' : '\u2191' : '\u2195';

      return h('span', { class: 'sort' }, arrow);
    },

    renderDragHandle(index: number): VNode {
      const h = this.$createElement;
      return h('span',
        {
          class: 'handle',
          attrs: {
            draggable: true,
          },
          on: {
            dragstart: (event: DragEvent) => this.onDragStart(event, index),
            click: (event: MouseEvent) => event.stopPropagation(),
          },
        },
        '\u21d4',
      );
    },

    renderBody(): VNode {
      const h = this.$createElement;

      return h('tbody',
        this.items.map(item => this.renderRow(item)),
      );
    },

    renderRow(item: IItem): VNode {
      const h = this.$createElement;

      return h('tr',
        {
          key: item.id,
        },
        this.columns.map((column, index) => this.renderBodyCell(item, column, index)),
      );
    },

    renderBodyCell(item: IItem, column: IColumn, index: number): VNode {
      return this.renderCell('td', column.key, index, item[column.key]);
    },

    getColumnStyle(index: number) {
      if (!this.shiftValues) return undefined;
      return {
        transform: `translateX(${this.shiftValues[index]}px)`,
      };
    },

    getColumnClass(index: number): { [key: string]: boolean } {
      if (this.drag && this.drag.startX !== 0) {
        return { 'dragging notransition': index === this.drag.dragColumnIndex };
      }

      return {
        'last-dragged': index === this.lastDragged,
        'notransition': !!this.drag && this.drag.startX === 0,
      };
    },
  },

  render(): VNode {
    return this.$createElement('div',
      {
        class: 'data-table',
        on: {
          drag: this.onDrag,
          dragenter: this.onDragOver,
          dragover: this.onDragOver,
          drop: this.onDrop,
          dragend: this.onDragEnd,
          scroll: this.onScroll,
        },
      },
      [
        this.renderTable(),
      ],
    );
  },
});
</script>

<style scoped lang="scss">

$outer-border : 1px solid #bbb;
$inner-border : 1px solid #ccc;

.data-table {
  border: $outer-border;
  border-radius: 3px;
  background-color: #ddd;

  overflow: auto;
  max-height: 100%;
}

.data-table > table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  td {
    background-color: #fff;
    position: relative;
    z-index: 0;

    &.dragging,
    &.last-dragged {
      z-index: 1;
    }
  }

  th {
    background-color: #f1f1f1;
    position: sticky;
    top: 0;
    z-index: 2;

    &.dragging,
    &.last-dragged {
      z-index: 3;
    }
  }

  th, td {
    text-align: left;
    white-space: nowrap;
    padding: 0 16px;
    height: 40px;
    line-height: 40px;

    &:not(:last-child) {
      border-right: $inner-border;
    }

    &.dragging {
      border-left: $inner-border;
      border-right: $inner-border;
      opacity: .8;
    }

    &:not(.notransition) {
      transition: transform .3s;
    }
  }

  tr:not(:last-child) {
    th, td {
      border-bottom: $inner-border;
    }
  }

  .th-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .handle {
    cursor: move;
    margin-left: 8px;
    color: #666;
  }

  .sort {
    margin-left: 8px;
  }

  .sortable {
    cursor: pointer;
  }
}
</style>
