import Vue, { VNode, VNodeChildrenArrayContents } from 'vue';
import debounce from 'debounce';
import { IColumn, IItem, ISortState } from '../types';
import { classHelper, joinKeyPath } from '../../lib/utils';
import SIcon from '../SIcon.vue';
import SSvg from './SSvg.vue';

const MAX_PLACEHOLDER_ROWS = 50;
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
  currentDropIndex: number;

  widths: number[];
  height: number;
  scrollX: number;
}

// Internal representation of a data item, with added properties for correct rendering
interface ITableNode {
  key: string;
  keyPath: string[];
  item: IItem;
  parent: ITableNode | null;
  children: ITableNode[] | null;
  isLastChild: boolean;
}

const sum = (numbers: number[]) => numbers.reduce((s, v) => s + v, 0);

export default Vue.extend({
  name: 'data-table-internal',

  components: {
    SIcon,
    SSvg,
  },

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
      drag: null as IDragState | null,
      moveTimeoutId: undefined as number | undefined,
      openNodes: [] as string[],
    };
  },

  computed: {
    rootNodes(): ITableNode[] {
      return this.getNodes(null, this.items);
    },

    firstContentColumn(): number {
      // XXX Need this if toggle/outline is in separate column
      return 0;
    },

    rowHeight(): number {
      // XXX Coupled to CSS
      return this.condensed ? CONDENSED_ROW_HEIGHT : NORMAL_ROW_HEIGHT;
    },

    renderedColgroup(): VNode {
      return this.renderColgroup();
    },

    renderedBody(): VNode {
      return this.renderBody();
    },

    renderedTopSpacer(): VNode[] {
      return this.renderTopSpacer();
    },

    renderedBottomSpacer(): VNode[] {
      return this.renderBottomSpacer();
    },

    renderedRootNodes(): VNode[] {
      return this.renderRootNodes();
    },
  },

  methods: {
    getThresholds(widths: number[]): number[] {
      let res: number[] = [];
      let total = 0;

      widths.forEach((w: number) => {
        res.push(total + w / 2);
        total += w;
      });

      // Add sentinel value to simplify logic
      res.push(Number.MAX_VALUE);

      return res;
    },

    getCurrentDropIndex(widths: number[], left: number): number {
      let { firstContentColumn } = this;
      let thresholds = this.getThresholds(widths);
      let index = Math.max(firstContentColumn,
        thresholds.findIndex(t => t > left));

      return index - firstContentColumn;
    },

    isOpen(node: ITableNode): boolean {
      return this.openNodes.includes(node.key);
    },

    toggleOpen(node: ITableNode) {
      if (this.isOpen(node)) {
        this.openNodes = this.openNodes.filter(k => k !== node.key);
      } else {
        this.openNodes.push(node.key);
        this.$emit('open-item', node.keyPath);
      }
    },

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
          currentDropIndex: this.getCurrentDropIndex(widths, event.x - rect.left),
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

      let { dragColumnIndex, currentDropIndex } = this.drag;

      let from = dragColumnIndex;
      let to = currentDropIndex;

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

      this.drag.currentDropIndex = this.getCurrentDropIndex(this.drag.widths, event.x - rect.left);
    },

    onPointerOut(event: PointerEvent) {
      clearTimeout(this.moveTimeoutId);
    },

    onScroll(event: UIEvent) {
      let element = event.target as HTMLElement;
      if (element === null) return;

      let scrollTop = element.scrollTop;
      let scrollBottom = element.scrollTop + element.clientHeight;

      const bottomSpacer = this.$refs['bottom-spacer'] as HTMLElement;
      if (bottomSpacer) {
        const spacerPos = bottomSpacer.offsetTop;
        if (spacerPos < scrollBottom) {
          const spacerOffset = Math.max(0, scrollTop - spacerPos);
          const rowOffset = Math.floor(spacerOffset / this.rowHeight);

          const rows = Math.ceil((scrollBottom - spacerPos) / this.rowHeight) - rowOffset;

          let firstRow = this.skip + this.rootNodes.length + rowOffset;
          let lastRow = firstRow + rows;

          const args = {firstRow, lastRow};
          this.$emit('visible-rows', args);
        }
      }

      const topSpacer = this.$refs['top-spacer'] as HTMLElement;
      if (topSpacer) {
        const spacerPos = topSpacer.offsetTop;
        if (spacerPos > scrollTop) {
          const spacerOffset = Math.max(0, spacerPos - scrollBottom);
          const rowOffset = Math.floor(spacerOffset / this.rowHeight);

          console.log('spacerOffset', spacerOffset);
          console.log('rowOffste', rowOffset);

          console.log('rows', Math.ceil((spacerPos - scrollTop) / this.rowHeight));

          const rows = Math.ceil((spacerPos - scrollTop) / this.rowHeight) - rowOffset;

          let lastRow = this.skip - rowOffset;
          let firstRow = Math.floor(scrollTop / this.rowHeight);

          const args = {firstRow, lastRow};
          this.$emit('visible-rows', args);
        }
      }
    },

    // Placeholder for type safety
    debounceOnScroll(event: UIEvent) { /* empty */ },

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
          this.renderedColgroup,
          this.renderHeader(),
          this.renderedBody,
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
          this.renderedTopSpacer,
          this.renderedRootNodes,
          this.renderedBottomSpacer,
        ]);
    },

    getNodes(parent: ITableNode | null, items: IItem[]): ITableNode[] {
      const keyPath = parent != null ? parent.keyPath : [];
      return items.map((item: IItem, i: number): ITableNode => {
        const itemKeyPath = keyPath.concat(item.key);
        const node: ITableNode = {
          key: joinKeyPath(itemKeyPath),
          keyPath: itemKeyPath,
          parent,
          item,
          isLastChild: i === items.length - 1,
          children: item.children === null ? null : [],
        };

        if (item.children) {
          node.children = this.getNodes(node, item.children);
        }
        return node;
      });
    },

    renderRootNodes(): VNode[] {
      return this.renderNodes(this.rootNodes);
    },

    renderNodes(nodes: ITableNode[]): VNode[] {
      return nodes.reduce(
        (value: VNode[], node: ITableNode, i: number) => (
          value.concat(this.renderNode(node, this.skip + i))
        ), []);
    },

    renderNode(node: ITableNode, row: number): VNode[] {
      const h = this.$createElement;
      const el = h('tr', {
          key: row, // FIXME duplicate key for sub-items
        }, [
          this.columns.map((column, index) =>
            this.renderContentCell(node, column, index)),
        ],
      );

      if (this.isOpen(node) && node.children) {
        return [el].concat(this.renderNodes(node.children));
      } else {
        return [el];
      }
    },

    renderToggle(node: ITableNode): VNode {
      const h = this.$createElement;

      const hasChildren = node.children && node.children.length ||
        node.item.totalChildren && node.item.totalChildren > 0;
      const mayHaveChildren = !node.children && node.item.totalChildren === -1;
      const isLoading = !node.children && this.isOpen(node);

      let children = [];
      if (isLoading) {
        children.push(h('s-svg', {props: {name: 'progress'}}));
      } else if (hasChildren || mayHaveChildren) {
        children.push(h('s-svg', {props: {name: 'arrow'}}));
      } else {
        children.push(h('i', {domProps: {innerHTML: '&nbsp;'}}));
      }

      return h('span', {
        class: toggleClassHelper({
          loading: isLoading,
          open: !isLoading && this.isOpen(node),
          unknown: !isLoading && mayHaveChildren,
        }),
        on: {
          click: () => {
            this.toggleOpen(node);
          },
        },
      }, children);
    },

    renderOutline(node: ITableNode): VNode {
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
        (this.isOpen(node) && node.children && node.children.length) ? this.renderTail() : '',
        node.item.icon ? h('s-icon', {class: 's-data-table__icon', props: {name: node.item.icon}}) : '',
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
      const mid = this.rowHeight / 2 - 1;
      return this.renderGraph([
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH / 2,
          y1: 0,
          y2: continues ? this.rowHeight : mid,
        },
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH - 4,
          y1: mid,
          y2: mid,
        },
      ]);
    },

    renderTail(): VNode {
      return this.renderGraph([
        {
          x1: OUTLINE_WIDTH / 2,
          x2: OUTLINE_WIDTH / 2,
          y1: this.rowHeight / 2 + 14,
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

    renderTopSpacer(): VNode[] {
      let rows = this.skip;
      if (rows === 0) return [];

      const placeholderRows = Math.min(rows, MAX_PLACEHOLDER_ROWS);
      const spacerRows = rows - placeholderRows;

      let nodes: VNode[] = [];
      nodes = nodes.concat(this.renderSpacer(spacerRows));
      nodes = nodes.concat(this.renderPlaceholders(spacerRows, placeholderRows));
      nodes.push(this.renderTracker('top-spacer'));
      return nodes;
    },

    renderBottomSpacer(): VNode[] {
      const startRow = this.skip + this.items.length;
      let rows = this.total == null ? 1 : this.total - startRow;
      if (rows === 0) return [];

      const placeholderRows = Math.min(rows, MAX_PLACEHOLDER_ROWS);
      const spacerRows = rows - placeholderRows;

      let nodes: VNode[] = [];
      nodes.push(this.renderTracker('bottom-spacer'));
      nodes = nodes.concat(this.renderPlaceholders(startRow, placeholderRows));
      nodes = nodes.concat(this.renderSpacer(spacerRows));
      return nodes;
    },

    renderPlaceholders(startRow: number, rows: number): VNode[] {
      if (rows === 0) return [];

      const h = this.$createElement;

      const nodes: VNode[] = [];

      // tslint:disable-next-line:no-bitwise
      const hash = (x: number, y: number): number => mod(((x << 24) ^ (y << 8)), 41);
      const mod = (x: number, m: number): number => ((x % m) + m) % m;

      for (let i = 0; i < rows; i++) {
        const row = startRow + i;
        const el = h('tr', {
            key: row,
          }, [
            this.columns.map((column, index) =>
              h('td', {
                  key: column.key,
                  class: this.getColumnClass(column, index),
                }, [
                  h('span', {staticClass: 's-data-table__cell-wrapper'}, [
                    h('span', {staticClass: 's-data-table__cell-content'}, [
                      h('span', {
                        staticClass: 's-data-table__cell-placeholder',
                        style: {width: `${hash(row, index) + 20}px`},
                      }),
                    ]),
                  ]),
                ],
              ),
            ),
          ],
        );
        nodes.push(el);
      }

      return nodes;
    },

    renderSpacer(rows: number): VNode[] {
      const h = this.$createElement;
      if (rows === 0) return [];

      let height = `${rows * this.rowHeight}px`;
      return [h('tr', {style: {height}})];
    },

    // This is used to track scroll position
    renderTracker(ref: string): VNode {
      const h = this.$createElement;
      return h('tr', { ref, key: ref });
    },

    renderHeaderCell(column: IColumn, index: number): VNode {
      const h = this.$createElement;

      const children: Array<string | VNode> = [];

      if (index === 0 && this.$slots.menu) {
        children.push(
          h('span', {
            on: {
              click: (event: PointerEvent) => { event.stopPropagation(); },
              pointerdown: (event: PointerEvent) => { event.stopPropagation(); },
            },
          }, this.$slots.menu),
        );
      }

      children.push(h('span', {staticClass: 's-data-table__cell-content'}, column.title));

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
        }, [
          h('span', {staticClass: 's-data-table__cell-wrapper'}, [
            children,
          ]),
        ],
      );
    },

    renderContentCell(node: ITableNode, column: IColumn, index: number): VNode | string | VNodeChildrenArrayContents {
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
      let content = slot ? slot({value, item: node.item}) : value;

      children.push(h('span', {staticClass: 's-data-table__cell-content'}, [ content ]));

      return h('td', {
          key,
          class: this.getColumnClass(column, index),
        }, [
          h('span', {staticClass: 's-data-table__cell-wrapper'}, [
            children,
          ]),
        ],
      );
    },

    renderSortArrows(reverse: boolean): VNode {
      const h = this.$createElement;

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
        let { drag, firstContentColumn } = this;
        let { currentDropIndex } = drag;

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

    isDragging(index: number): boolean {
      if (this.drag === null) return false;
      return index === this.drag.dragColumnIndex;
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
            scroll: this.debounceOnScroll,
          },
        }, [
          this.renderTable(),
        ]),
      ],
    );
  },

  created() {
    this.debounceOnScroll = debounce(this.onScroll, SCROLL_DEBOUNCE);
  },

  beforeDestroy(this: any) {
    clearTimeout(this.moveTimeoutId);
  },
});
