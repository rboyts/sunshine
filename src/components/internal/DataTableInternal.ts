import Vue, { VNode, VNodeChildrenArrayContents } from 'vue';
import debounce from 'debounce';
import { IColumn, IItem, ISortState } from '../types';
import { classHelper } from '@/lib/utils';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 500;

const columnClassHelper = classHelper('ui-data-table', 'col');
const headerClassHelper = classHelper('ui-data-table', 'header');
const sortClassHelper = classHelper('ui-data-table', 'header', 'sort');

interface IDragState {
  dragColumnIndex: number;
  left: number;
  widths: number[];
  height: number;
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
      moveTimeoutId: undefined as number | undefined,
    };
  },

  computed: {
    thresholds(): number[] {
      if (!this.drag) return [];

      let { dragColumnIndex, widths } = this.drag;

      let res: number[] = [];
      let total = 0;

      widths.forEach((w, i) => {
        res.push(total + w / 2);
        total += w;
      });

      // Add sentinel value to simplify logic
      res.push(Number.MAX_VALUE);

      return res;
    },

    currentDropIndex(): number {
      if (!this.drag) return -1;
      let { drag } = this;
      let index = this.thresholds.findIndex(t => t > drag.left);

      return index;
    },
  },

  methods: {
    onMouseDown(event: PointerEvent, index: number) {
      event.preventDefault();

      clearTimeout(this.moveTimeoutId);
      this.moveTimeoutId = setTimeout(() => {
        let el = event.target as HTMLElement;
        el.setPointerCapture(event.pointerId);

        let tr = el.closest('tr') as HTMLElement;
        if (tr === null) return;

        let root = tr.closest('.ui-data-table') as HTMLElement;
        if (root === null) return;

        let height = root.scrollHeight;
        let widths: number[] = [];
        for (let c of tr.children) {
          widths.push((c as HTMLElement).offsetWidth);
        }

        let rect = tr.getBoundingClientRect();

        this.drag = {
          dragColumnIndex: index,
          left: event.x - rect.left,
          widths,
          height,
        };
      }, MOVE_TIMEOUT);
    },

    onMouseUp(event: PointerEvent) {
      clearTimeout(this.moveTimeoutId);

      if (!this.drag) return;

      event.preventDefault();

      let { dragColumnIndex } = this.drag;

      let from = dragColumnIndex;
      let to = this.currentDropIndex;

      this.drag = null;

      if (to > from) to--;
      if (to === from) return null;

      this.moveColumn(from, to);
    },

    onPointerMove(event: PointerEvent) {
      if (!this.drag) return;

      let el = event.target as HTMLElement;
      let tr = el.closest('tr') as HTMLElement;
      let rect = tr.getBoundingClientRect();

      this.drag.left = event.x - rect.left;
    },

    onPointerOut(event: PointerEvent) {
      clearTimeout(this.moveTimeoutId);
    },

    onScroll(event: UIEvent) {
      let element = event.target as HTMLElement;
      if (element === null) return;

      // if (this.drag) {
      //   this.drag.curScrollX = element.scrollLeft;
      // }

      // XXX Coupled to CSS
      let rowHeight = this.condensed ? 24 : 40;

      let firstRow = Math.floor(element.scrollTop / rowHeight);
      let lastRow = Math.ceil((element.scrollTop + element.clientHeight) / rowHeight);

      this.emitVisible({firstRow, lastRow});

      if (element.scrollTop > 0 && element.scrollTop > element.scrollHeight - element.clientHeight - 1) {
        this.$emit('scroll-bottom');
      }
    },

    moveColumn(from: number, to: number) {
      // XXX: Mutating props is not a good idea!

      const moved = this.columns.splice(from, 1);
      this.columns.splice(to, 0, ...moved);
    },

    emitVisible: debounce(function(this: Vue, args: object) {
      this.$emit('visible-rows', args);
    }, SCROLL_DEBOUNCE),

    clearSelection() {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    },

    renderTable(): VNode {
      const h = this.$createElement;

      return h('table', {
          class: 'ui-data-table__table',
        }, [
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

    renderBody(): VNode {
      const h = this.$createElement;

      return h('tbody', [
          this.renderTopSpacer(),
          this.items.map((item, rowIndex) => h('tr', {
            key: rowIndex,
          }, [
            this.columns.map((column, index) =>
              this.renderContentCell(item, column, index))
          ])),
          this.renderBottomSpacer(),
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

      // spacer
      children.push(h('span', {style: {flex: 1}}));

      if (column.sortable) {
        children.push(this.renderSortArrows(column.key));
      }

      let on: { [key: string]: any } = {};

      if (column.sortable) {
        on.click = (event: MouseEvent) => this.$emit('sort', event, column.key);
      }

      if (this.draggable) {
        on.pointerdown = (event: PointerEvent) => this.onMouseDown(event, index);
        on.pointerup = this.onMouseUp;
        on.pointermove = this.onPointerMove;
        on.pointerout = this.onPointerOut;
      }

      return h('th', {
          key: column.key,
          class: this.getColumnClass(index),
        }, [
          h('div', {
            class: headerClassHelper({
                sortable: !!column.sortable,
              }),
            on,
          },
          children,
        ),
      ]);
    },

    renderContentCell(item: IItem, column: IColumn, index: number): VNode | string | VNodeChildrenArrayContents {
      const h = this.$createElement;
      let { key } = column;
      let value = item[key];
      let slot = this.$scopedSlots[`~${key}`];

      if (slot) {
        return slot({value, item});
      } else if (value) {
        return h('td', {class: this.getColumnClass(index)}, value);
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

    renderMoveCursor(): VNode {
      const h = this.$createElement;

      let children = [];

      if (this.drag != null) {
        let { drag, currentDropIndex } = this;

        let width = 6;
        if (currentDropIndex === drag.dragColumnIndex + 1)
          currentDropIndex = drag.dragColumnIndex;

        let pos = sum(drag.widths.slice(0, currentDropIndex));
        if (currentDropIndex === drag.dragColumnIndex) {
          width = drag.widths[drag.dragColumnIndex];
        } else if (currentDropIndex === drag.widths.length) {
          pos -= width;
        } else if (currentDropIndex > 0) {
          pos -= width / 2;
        }

        children.push(h('div', {
          class: 'ui-data-table__move-cursor',
          style: {
            left: `${pos}px`,
            width: `${width}px`,
          },
        }));
      }

      return h('div', {class: 'ui-data-table__move-overlay'}, children);
    },

    getColumnClass(index: number) {
      return columnClassHelper({ dragging: this.isDragging(index) });
    },

    isDragging(index: number) {
      let di = this.currentDropIndex;
      if (di === index + 1) di = index;
      return this.drag != null && index === this.drag.dragColumnIndex && di !== index;
    },
  },

  render(h): VNode {
    return h('div',
      {
        class: {
          'ui-data-table': true,
          'ui-data-table--condensed': this.condensed,
        },
        on: {
          scroll: this.onScroll,
        },
      },
      [
        this.renderMoveCursor(),
        h('div', {
          class: 'ui-data-table__wrapper',
        }, [
          this.renderTable(),
        ]),
      ],
    );
  },

  beforeDestroy(this: any) {
    clearTimeout(this.moveTimeoutId);
  },
});
