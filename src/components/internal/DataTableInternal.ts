import Vue, { VNode, VNodeChildrenArrayContents } from 'vue';
import debounce from 'debounce';
import { IColumn, IItem, IItemData, ISortState } from '../types';
import { classHelper } from '@/lib/utils';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 500;

const NORMAL_ROW_HEIGHT = 40;
const CONDENSED_ROW_HEIGHT = 24;
const OUTLINE_WIDTH = 24;   // Must correspond to CSS

const tableClassHelper = classHelper('ui-data-table');
const columnClassHelper = classHelper('ui-data-table', 'col');
const headerClassHelper = classHelper('ui-data-table', 'header');
const sortClassHelper = classHelper('ui-data-table', 'header', 'sort');

interface IDragState {
  dragColumnIndex: number;
  left: number;
  widths: number[];
  height: number;
  scrollX: number;
}

interface INode {
  key: string;
  item: IItem;
  parent: INode | null;
  children: INode[];
  isLastChild: boolean;
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

    stickyColumn: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      drag: null as IDragState | null,
      moveTimeoutId: undefined as number | undefined,
    };
  },

  computed: {
    nodes(): INode[] {
      return this.getNodes(null, this.items);
    },

    firstContentColumn(): number {
      return 1;
    },

    rowHeight(): number {
      // XXX Coupled to CSS
      return this.condensed ? CONDENSED_ROW_HEIGHT : NORMAL_ROW_HEIGHT;
    },

    thresholds(): number[] {
      if (!this.drag) return [];

      let { widths } = this.drag;

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
      let { drag, firstContentColumn } = this;
      let index = Math.max(firstContentColumn,
        this.thresholds.findIndex(t => t > drag.left));

      return index - firstContentColumn;
    },
  },

  methods: {
    onMouseDown(event: PointerEvent, index: number) {
      event.preventDefault();

      clearTimeout(this.moveTimeoutId);
      this.moveTimeoutId = setTimeout(() => {
        let el = event.target as HTMLElement;

        let tr = el.closest('tr') as HTMLElement;
        if (tr === null) return;

        let root = tr.closest('.ui-data-table__wrapper') as HTMLElement;
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
          scrollX: root.scrollLeft,
        };

        el.setPointerCapture(event.pointerId);
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

      this.$emit('move-column', {from, to});
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

      let firstRow = Math.floor(element.scrollTop / this.rowHeight);
      let lastRow = Math.ceil((element.scrollTop + element.clientHeight) / this.rowHeight);

      this.emitVisible({firstRow, lastRow});

      // if (element.scrollTop > 0 && element.scrollTop > element.scrollHeight - element.clientHeight - 1) {
      //   this.$emit('scroll-bottom');
      // }
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
        h('tr', [
          h('th', [h('i', {class: 'fas fa-ellipsis-h'})]),
          this.columns.map((column, index) => this.renderHeaderCell(column, index)),
        ]),
      ]);
    },

    renderBody(): VNode {
      const h = this.$createElement;

      return h('tbody', [
          this.renderTopSpacer(),
          this.renderNodes(this.nodes),
          this.renderBottomSpacer(),
        ]);
    },

    getNodes(parent: INode | null, items: IItem[]): INode[] {
      const prefix = parent != null ? parent.key : '';
      return items.map((item: IItem, i: number): INode => {
        const node: INode = {
          key: `${prefix}:${i}`,
          parent,
          item,
          isLastChild: i === items.length - 1,
          children: [],
        };

        node.children = this.getNodes(node, item._children);
        return node;
      });
    },

    renderNodes(nodes: INode[]): any[] {
      return nodes.map((node: INode) => this.renderNode(node));
    },

    renderNode(node: INode): any[] {
      const h = this.$createElement;
      const el = h('tr', {
          key: node.key,
        }, [
          this.renderChevron(node),
          this.columns.map((column, index) =>
            this.renderContentCell(node, column, index)),
        ],
      );
      return [el].concat(this.renderNodes(node.children));
    },

    renderChevron(node: INode): VNode {
      const h = this.$createElement;

      let children = [];
      if (node.children.length) {
        children.push(h('i', {class: 'fas fa-chevron-down'}));
      } else {
        children.push(h('i', {domProps: {innerHTML: '&nbsp;'}}));
      }

      return h('td', children);
    },

    renderOutline(node: INode): VNode {
      const h = this.$createElement;

      let children = [];

      // Draw outline for this item, if it is a child item. This line will
      // connect to the line of the line above.
      if (node.parent != null) {
        children.push(h('span', {class: 'ui-data-table__outline__section'}, [
          this.renderAngle(!node.isLastChild),
        ]));
      }

      // Render icon and start line that child items will connect to, if any.
      children.push(h('span', {class: 'ui-data-table__outline__section'}, [
        node.children.length ? this.renderTail() : '',
        node.item.icon ? h('i', {class: [node.item.icon, 'ui-data-table__icon']}) : '',
      ]));

      // Render nested children with correct indentation, and connect lines between
      // grandparents and remaining items, at any level. Unlimited number of levels are
      // supported, by traversing the parent hierarchy, and inserting sections
      // to the beginning of the array.
      let p = node.parent;
      while (p != null) {
        if (p.parent) {
          children.unshift(h('span', {class: 'ui-data-table__outline__section'}, [
            !p.isLastChild ? this.renderLine() : '',
          ]));
        }
        p = p.parent;
      }

      return h('span', {class: 'ui-data-table__outline'}, children);
    },

    renderLine(): VNode {
      const h = this.$createElement;

      return h('svg', {
        attrs: {
          width: OUTLINE_WIDTH,
          height: this.rowHeight,
        },
      },
      [
        h('line', {
          attrs: {
            x1: OUTLINE_WIDTH / 2,
            x2: OUTLINE_WIDTH / 2,
            y1: 0,
            y2: this.rowHeight,
          },
        }),
      ]);
    },

    renderAngle(continues: boolean): VNode {
      const h = this.$createElement;

      return h('svg', {
        attrs: {
          width: OUTLINE_WIDTH,
          height: this.rowHeight,
        },
      },
      [
        h('line', {
          attrs: {
            x1: OUTLINE_WIDTH / 2,
            x2: OUTLINE_WIDTH / 2,
            y1: 0,
            y2: continues ? this.rowHeight : this.rowHeight / 2,
          },
        }),
        h('line', {
          attrs: {
            x1: OUTLINE_WIDTH / 2,
            x2: OUTLINE_WIDTH,
            y1: this.rowHeight / 2,
            y2: this.rowHeight / 2,
          },
        }),
      ]);
    },

    renderTail(): VNode {
      const h = this.$createElement;

      return h('svg', {
        attrs: {
          width: OUTLINE_WIDTH,
          height: this.rowHeight,
        },
      },
      [
        h('line', {
          attrs: {
            x1: OUTLINE_WIDTH / 2,
            x2: OUTLINE_WIDTH / 2,
            y1: this.rowHeight / 2 + 12,
            y2: this.rowHeight,
          },
        }),
      ]);
    },

    renderTopSpacer(): VNode {
      return this.renderSpacer(this.skip);
    },

    renderBottomSpacer(): VNode {
      let rows = this.total == null ? 1 : this.total - (this.skip + this.items.length);
      return this.renderSpacer(rows);
    },

    renderSpacer(rows: number): VNode {
      const h = this.$createElement;

      let height = `${rows * this.rowHeight}px`;

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

    renderContentCell(node: INode, column: IColumn, index: number): VNode | string | VNodeChildrenArrayContents {
      const h = this.$createElement;
      let { key } = column;
      let value = node.item.data[key];
      let slot = this.$scopedSlots[`~${key}`];

      if (slot) {
        return slot({value, node});
      } else if (`${value}`.trim().length) {
        return h('td', {key: column.key, class: this.getColumnClass(index)}, [
          index === 0 ? this.renderOutline(node) : null,
          value,
        ]);
      } else {
        return h('td', {key: column.key, domProps: {innerHTML: '&nbsp;'}});
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
        let { drag, firstContentColumn, currentDropIndex } = this;

        let width = 6;
        if (currentDropIndex === drag.dragColumnIndex + 1)
          currentDropIndex = drag.dragColumnIndex;

        let widthIndex = firstContentColumn + currentDropIndex;

        let pos = sum(drag.widths.slice(0, widthIndex)) - drag.scrollX;
        if (currentDropIndex === drag.dragColumnIndex) {
          width = drag.widths[widthIndex];
        } else if (widthIndex === drag.widths.length) {
          pos -= width;
        } else if (widthIndex > 0) {
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

      return h('div', children);
    },

    getColumnClass(index: number) {
      return columnClassHelper({
        sticky: index === 0 && this.stickyColumn,
        dragging: this.isDragging(index),
      });
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
        class: tableClassHelper({
          condensed: this.condensed,
          dragging: this.drag != null,
        }),
      },
      [
        this.renderMoveCursor(),
        h('div', {
          class: 'ui-data-table__wrapper',
          on: {
            scroll: this.onScroll,
          },
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
