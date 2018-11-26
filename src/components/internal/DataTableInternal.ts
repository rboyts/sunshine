import Vue, { VNode, VNodeChildrenArrayContents } from 'vue';
import debounce from 'debounce';
import { IColumn, IItem, ISortState } from '../types';
import { classHelper } from '@/lib/utils';

const SCROLL_DEBOUNCE = 250;

const columnClassHelper = classHelper('ui-data-table', 'column');
const headerClassHelper = classHelper('ui-data-table', 'header');
const sortClassHelper = classHelper('ui-data-table', 'header', 'sort');

interface IDragState {
  dragColumnIndex: number;
  startX: number;
  curX: number;
  startScrollX: number;
  curScrollX: number;
  widths: number[];
  wrapperWidth: number;
}

const sum = (numbers: number[]) => numbers.reduce((s, v) => s + v, 0);

export default Vue.extend({
  name: 'data-table-internal',

  props: {
    columns: Array as () => IColumn[],
    items: Array as () => IItem[],
    total: Number as () => number | null,
    skip: Number,
    sorting: Object as () => ISortState,
    draggable: Boolean,
    condensed: Boolean,
  },

  data() {
    return {
      drag: null as IDragState | null,
      lastDragged: null as number | null,
      notransition: false,
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
    async onDrop(event: DragEvent) {
      event.preventDefault();

      if (!this.drag) return;

      let { dragColumnIndex, widths } = this.drag;

      let from = dragColumnIndex;
      let to = this.currentDropIndex;

      // Prevent sliding animations when re-positioning columns
      this.notransition = true;

      // Wait one tick for the transitions to be disabled
      await Vue.nextTick();

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
        wrapperWidth: 0,
      };

      // Give the columns one tick to settle in the new spot, before enabling
      // animations, and letting them slide back into place
      await Vue.nextTick();

      this.lastDragged = to;
      this.drag = null;
      this.notransition = false;
    },

    onDragEnd(event: DragEvent) {
      event.preventDefault();

      // Need to delay resetting the state until the current state is rendered,
      // for animations to be correct
      // Vue.nextTick(() => {
      //   // window.requestAnimationFrame(() => {
      //     this.notransition = false;
      //     if (this.drag)
      //       this.lastDragged = this.drag.dragColumnIndex;

      //     this.drag = null;
      //   // });
      // });
    },

    onDragStart(event: DragEvent, index: number) {
      let element = event.currentTarget as HTMLElement;
      if (element === null) return;

      this.clearSelection();

      let viewport = element.closest('.ui-data-table__wrapper');
      if (viewport === null) return;

      let root = viewport.closest('.ui-data-table');
      if (root === null) return;

      let widths: number[] = [];
      for (let c of viewport.children) {
        widths.push((c as HTMLElement).offsetWidth);
      }

      this.lastDragged = null;
      this.drag = {
        dragColumnIndex: index, startX: event.clientX,
        curX: event.clientX,
        startScrollX: root.scrollLeft,
        curScrollX: root.scrollLeft,
        widths,
        wrapperWidth: viewport.scrollWidth,
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
      let element = event.target as HTMLElement;
      if (element === null) return;

      if (this.drag) {
        this.drag.curScrollX = element.scrollLeft;
      }

      // XXX Coupled to CSS
      let rowHeight = this.condensed ? 24 : 40;

      let firstRow = Math.floor(element.scrollTop / rowHeight);
      let lastRow = Math.ceil((element.scrollTop + element.clientHeight) / rowHeight);

      this.emitVisible({firstRow, lastRow});

      if (element.scrollTop > 0 && element.scrollTop > element.scrollHeight - element.clientHeight - 1) {
        this.$emit('scroll-bottom');
      }
    },

    emitVisible: debounce(function(this: Vue, args: object) {
      this.$emit('visible-rows', args);
    }, SCROLL_DEBOUNCE),

    clearSelection() {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    },

    renderTable(): VNode[] {
      const h = this.$createElement;

      return this.columns.map((column, index) => this.renderColumn(column, index));
    },

    renderColumn(column: IColumn, index: number) {
      const h = this.$createElement;

      return h('table', {
          key: column.key,
          class: this.getColumnClass(index),
          style: this.getColumnStyle(index),
        }, [
        h('thead', [
          h('tr', [
            this.renderHeaderCell(column, index),
          ]),
        ]),
        h('tbody', [
          this.renderTopSpacer(),
          this.items.map((item) => h('tr', [
            this.renderContentCell(item, column),
          ])),
          this.renderBottomSpacer(),
        ]),
      ]);
    },

    renderTopSpacer() {
      return this.renderSpacer(this.skip);
    },

    renderBottomSpacer() {
      let rows = this.total == null ? 1 : this.total - (this.skip + this.items.length);
      return this.renderSpacer(rows);
    },

    renderSpacer(rows: number) {
      const h = this.$createElement;

      let rowHeight = this.condensed ? 1.5 : 2.5;
      let height = `${rows * rowHeight}rem`;

      return h('tr', {style: {height}}, []);
    },

    renderHeaderCell(column: IColumn, index: number): VNode {
      const h = this.$createElement;

      const children: Array<string | VNode> = [];

      children.push(column.title);

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
        on.click = (event: MouseEvent) => this.$emit('sort', event, column.key);
      }

      return h('th', {
        class: headerClassHelper({
            sortable: !!column.sortable,
          }),
        on,
      },
      children,
      );
    },

    renderContentCell(item: IItem, column: IColumn): VNode | string | VNodeChildrenArrayContents {
      const h = this.$createElement;
      let { key } = column;
      let value = item[key];
      let slot = this.$scopedSlots[`~${key}`];
      if (slot) {
        return slot({value, item});
      } else if (value) {
        return h('td', value);
      } else {
        return h('td', {domProps: {innerHTML: '&nbsp;'}});
      }
    },

    renderSortArrows(key: string): VNode {
      const h = this.$createElement;

      let { sorting } = this;

      let arrow = sorting.key === key ? '\u2191' : '\u2195';
      let rotate = sorting.key === key ? sorting.reverse ? '180deg' : '0' : '0';

      return h('span', {
        class: sortClassHelper({
          reverse: sorting.reverse,
        }),
        style: {
          transform: `rotate(${rotate})`,
        },
      }, arrow);
    },

    renderDragHandle(index: number): VNode {
      const h = this.$createElement;
      return h('span',
        {
          class: 'ui-data-table__header__handle',
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

    getColumnStyle(index: number) {
      if (!this.shiftValues) return undefined;
      return {
        transform: `translateX(${this.shiftValues[index]}px)`,
      };
    },

    getColumnClass(index: number): { [key: string]: boolean } {
      if (this.drag && this.drag.startX !== 0) {
        let isDragging = index === this.drag.dragColumnIndex;

        return columnClassHelper({
          dragging: isDragging,
          notransition: isDragging || this.notransition,
        });
      }

      return columnClassHelper({
        'last-dragged': index === this.lastDragged,
        'notransition': this.notransition || !!this.drag && this.drag.startX === 0,
      });
    },
  },

  render(h): VNode {

    let style: any = {};
    if (this.drag && this.drag.wrapperWidth !== 0) {
      style.width = `${this.drag.wrapperWidth}px`;
    }

    return h('div',
      {
        class: {
          'ui-data-table': true,
          'ui-data-table--condensed': this.condensed,
        },
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
        h('div', {
          class: 'ui-data-table__wrapper',
          style,
        }, [
          this.renderTable(),
        ]),
      ],
    );
  },
});
