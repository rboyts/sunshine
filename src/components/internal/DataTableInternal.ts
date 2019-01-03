import Vue, { VNode, VNodeChildrenArrayContents, CreateElement } from 'vue';
import debounce from 'debounce';
import { IColumn, IItem, IItemData, ISortState } from '../types';
import { classHelper } from '../../lib/utils';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 350;

const NORMAL_ROW_HEIGHT = 40;
const CONDENSED_ROW_HEIGHT = 24;
const OUTLINE_WIDTH = 24;   // Must correspond to CSS

const tableClassHelper = classHelper('s-data-table');
const columnClassHelper = classHelper('s-data-table', 'col');
const sortClassHelper = classHelper('s-data-table', 'sort');
const toggleClassHelper = classHelper('s-data-table', 'toggle');

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
  isOpen: boolean;
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

    outline: {
      type: Boolean,
      default: false,
    },

    fixed: {
      type: Boolean,
      default: false,
    },

    stickyColumn: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      menuOpen: false,
      drag: null as IDragState | null,
      moveTimeoutId: undefined as number | undefined,
      nodes: [] as INode[],
    };
  },

  watch: {
    items: {
      handler() {
        this.nodes = this.getNodes(null, this.items);
      },
      immediate: true,
    },
  },

  computed: {
    firstContentColumn(): number {
      // XXX Need this if toggle/outline is in separate column
      return 0;
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
      this.moveTimeoutId = window.setTimeout(() => {
        let el = event.target as HTMLElement;

        let tr = el.closest('tr') as HTMLElement;
        if (tr === null) return;

        let root = tr.closest('.s-data-table__wrapper') as HTMLElement;
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
          class: 's-data-table__table',
        }, [
          this.renderColgroup(),
          this.renderHeader(),
          this.renderBody(),
        ],
      );
    },

    renderColgroup(): VNode {
      const h = this.$createElement;

      const defaultWidth = this.fixed ? '150px' : 'auto';

      return h('colgroup', [
        this.columns.map(column =>
          h('col', {
            style: {
              width: column.width != null ? `${column.width}px` : defaultWidth,
            },
          }),
        ),
      ]);
    },

    renderHeader(): VNode {
      const h = this.$createElement;

      return h('thead', [
        h('tr', [
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
          isOpen: false,
        };

        node.children = item.children ? this.getNodes(node, item.children) : [];
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
          this.columns.map((column, index) =>
            this.renderContentCell(node, column, index)),
        ],
      );

      if (node.isOpen) {
        return [el].concat(this.renderNodes(node.children));
      } else {
        return [el];
      }
    },

    renderToggle(node: INode): VNode {
      const h = this.$createElement;

      let children = [];
      if (node.children.length) {
        children.push(h('i', {class: 'fas fa-chevron-down'}));
      } else {
        children.push(h('i', {domProps: {innerHTML: '&nbsp;'}}));
      }

      return h('span', {
        class: toggleClassHelper({open: node.isOpen === true}),
        on: {
          click: () => {
            node.isOpen = !node.isOpen;
          },
        },
      }, children);
    },

    renderOutline(node: INode): VNode {
      const h = this.$createElement;

      let children = [];

      // Draw outline for this item, if it is a child item. This line will
      // connect to the line of the line above.
      if (node.parent != null) {
        children.push(h('span', {class: 's-data-table__outline__section'}, [
          this.renderAngle(!node.isLastChild),
        ]));
      }

      // Render icon and start line that child items will connect to, if any.
      children.push(h('span', {class: 's-data-table__outline__section'}, [
        node.children.length && node.isOpen ? this.renderTail() : '',
        node.item.icon ? h('i', {class: [node.item.icon, 's-data-table__icon']}) : '',
      ]));

      // Render nested children with correct indentation, and connect lines between
      // grandparents and remaining items, at any level. Unlimited number of levels are
      // supported, by traversing the parent hierarchy, and inserting sections
      // to the beginning of the array.
      let p = node.parent;
      while (p != null) {
        if (p.parent) {
          children.unshift(h('span', {class: 's-data-table__outline__section'}, [
            !p.isLastChild ? this.renderLine() : '',
          ]));
        }
        p = p.parent;
      }

      return h('span', {class: 's-data-table__outline'}, children);
    },

    renderLine(): VNode {
      return this.renderGraph([
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH / 2,
          y1: 0,
          y2: this.rowHeight,
        },
      ]);
    },

    renderAngle(continues: boolean): VNode {
      return this.renderGraph([
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH / 2,
          y1: 0,
          y2: continues ? this.rowHeight : this.rowHeight / 2,
        },
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH,
          y1: this.rowHeight / 2,
          y2: this.rowHeight / 2,
        },
      ]);
    },

    renderTail(): VNode {
      return this.renderGraph([
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH / 2,
          y1: this.rowHeight / 2 + 12,
          y2: this.rowHeight,
        },
      ]);
    },

    renderGraph(lines: object[]): VNode {
      const h = this.$createElement;

      return h('svg', {
          attrs: {
            width: OUTLINE_WIDTH,
            height: this.rowHeight,
          },
        },
        lines.map(attrs => h('line', { attrs })),
      );
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

      if (index === 0 && this.$slots.menu) {
        children.push(
          h('span', {
            class: toggleClassHelper({}),
            on: {
              click: (event: PointerEvent) => { event.stopPropagation(); },
            },
          }, this.$slots.menu),
        );
      }

      children.push(column.title);

      let { sorting } = this;
      if (sorting.key === column.key) {
        children.push(this.renderSortArrows(sorting.reverse));
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
          class: this.getColumnClass(column, index),
          on,
        },
        children,
      );
    },

    renderContentCell(node: INode, column: IColumn, index: number): VNode | string | VNodeChildrenArrayContents {
      const h = this.$createElement;
      let { key } = column;

      let children = [];

      if (this.outline && index === 0) {
        children.push(this.renderToggle(node));
        children.push(this.renderOutline(node));
      }

      let value = node.item.data[key];
      if (column.filter) {
        value = column.filter(value);
      }

      let slot = this.$scopedSlots[`~${key}`];
      if (slot) {
        children.push(slot({value, item: node.item}));
      } else {
        children.push(value);
      }

      return h('td', {
          key,
          class: this.getColumnClass(column, index),
        },
        children,
      );
    },

    renderSortArrows(reverse: boolean): VNode {
      const h = this.$createElement;

      let arrow = '\u2191';

      return h('span', {
        class: sortClassHelper({ reverse }),
      }, [
        h('span', { staticClass: 'fas fa-arrow-circle-up' }),
      ]);
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
          class: 's-data-table__move-cursor',
          style: {
            left: `${pos}px`,
            width: `${width}px`,
          },
        }));
      }

      return h('div', children);
    },

    getColumnClass(column: IColumn, index: number) {
      return columnClassHelper({
        sticky: index === 0 && this.stickyColumn,
        dragging: this.isDragging(index),
        right: column.align === 'right',
        center: column.align === 'center',
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
          fixed: this.fixed,
          dragging: this.drag != null,
        }),
      },
      [
        this.renderMoveCursor(),
        h('div', {
          class: 's-data-table__wrapper',
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
