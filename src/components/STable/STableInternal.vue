<template>
  <div :class="classes({ condensed, fixed, dragging: drag != null })">

    <div
      v-if="moveCursorStyle"
      :class="classes('move-cursor')"
      :style="moveCursorStyle"
    />

    <div :class="classes('wrapper')" @scroll="debounceOnScroll">
      <table
        @mousedown.shift.prevent="noop"
        :class="classes('table')"
      >

        <colgroup>
          <col v-for="(width, i) in colWidths" :key="i" :style="{ width }" />
        </colgroup>

        <thead>
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="column.key"
              :class="getColumnClass(column, index)"
              v-on="getHeaderListeners(column, index)"
            >
              <span :class="classes('cell-wrapper')">
                <span
                  v-if="index === 0"
                  @click.stop="noop"
                  @pointerdown.stop="noop"
                >
                  <s-table-options-menu
                    :checkable="checkable"
                    :orderedColumns="orderedColumns"
                    @selectAll="selectAll"
                    @selectNone="selectNone"
                    @toggleColumn="$emit('toggleColumn', $event)"
                  />
                </span>

                <span :class="classes('cell-content')">{{ column.title }}</span>

                <span
                  v-if="column.sortable"
                  :class="classes('sortcolumn', {
                    active: sorting.key === column.key,
                    reverse: sorting.reverse,
                  })"
                >
                  <s-icon package="sunshine24" name="sortcolumn" />
                </span>

              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="topSpacerRows > 0" :style="{ height: getSpacerHeight(topSpacerRows) }" />
          <tr v-if="topSpacerRows > 0" ref="top-spacer" />

          <slot v-if="rootNodes.length === 0" name="empty" />

          <tr
            v-for="node in rootNodes"
            :key="node.key"
            :class="classes('row', {
              checked: isChecked(node),
              active: activeRow === node.key,
            })"
            @click.exact.prevent="onClick($event, node)"
            @click.exact.ctrl.prevent="onCtrlClick(node)"
            @click.exact.shift.stop.prevent="onShiftClick(node)"
          >

            <td
              v-for="(column, index) in columns"
              :key="column.key"
              :class="getColumnClass(column, index)"
            >
              <span :class="classes('cell-wrapper')">

                <span v-if="checkable && index === 0" :class="classes('checkable')">
                  <s-checkable
                    :checked="isChecked(node)"
                    @click.stop="toggleChecked(node)"
                  />
                </span>

                <s-table-toggle
                  v-if="outline && index === 0"
                  :node="node"
                  :isOpen="isOpen(node)"
                  @toggle="toggleOpen(node)"
                />

                <s-table-outline
                  v-if="outline && index === 0"
                  :node="node"
                  :rowHeight="rowHeight"
                  :isOpen="isOpen(node)"
                />

                <span :class="classes('cell-content')">
                  <slot :name="`~${column.key}`" v-bind="{
                    value: getCellValue(node, column),
                    item: node.item,
                  }">
                    {{ getCellValue(node, column) }}
                  </slot>
                </span>
              </span>
            </td>
          </tr>

          <tr v-if="bottomSpacerRows > 0" ref="bottom-spacer" />
          <tr v-if="bottomSpacerRows > 0" :style="{ height: getSpacerHeight(bottomSpacerRows) }" />
        </tbody>

      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VNode, VNodeChildrenArrayContents } from 'vue';
import debounce from 'debounce';
import mixins from 'vue-typed-mixins';
import {
  IColumn, IItem, ISortState, ISelection, NO_SELECTION,
} from '../types';
import { ClassesMixin, get, joinKeyPath } from '../../lib/utils';
import SCheckable from '../SCheckable.vue';
import SIcon from '../SIcon.vue';
import SProgress from '../SProgress.vue';
import STableOutline from './STableOutline.vue';
import STableToggle from './STableToggle.vue';
import STableOptionsMenu from './STableOptionsMenu.vue';

const MAX_PLACEHOLDER_ROWS = 0;
const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 350;

const NORMAL_ROW_HEIGHT = 40;
const CONDENSED_ROW_HEIGHT = 24;

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
  hasSubItems: boolean;
  hasPendingSubItems: boolean;
  isLastChild: boolean;
}

const mod = (x: number, m: number): number => ((x % m) + m) % m;

// eslint-disable-next-line no-bitwise
const hash = (x: number, y: number): number => mod(((x << 24) ^ (y << 8)), 41);

const sum = (numbers: number[]) => numbers.reduce((s, v) => s + v, 0);

export default mixins(ClassesMixin).extend({
  name: 's-table',

  components: {
    SCheckable,
    SIcon,
    SProgress,
    STableOutline,
    STableToggle,
    STableOptionsMenu,
  },

  props: {
    columns: Array as () => IColumn[],
    orderedColumns: Array as () => IColumn[],
    items: Array as () => IItem[],
    total: Number as () => number | null,
    offset: Number,
    sorting: Object as () => ISortState,
    draggable: Boolean,
    condensed: Boolean,

    selection: Object as () => ISelection,

    checkable: {
      type: Boolean,
      default: false,
    },

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

      internalSelection: NO_SELECTION,
    };
  },

  watch: {
    selection: {
      handler(val) {
        this.internalSelection = val || NO_SELECTION;
      },
      immediate: true,
    },

    internalSelection(val) {
      if (val !== this.selection) {
        this.$emit('update:selection', val);
      }
    },
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

    moveCursorStyle(): object | null {
      if (this.drag == null) return null;

      let { drag, firstContentColumn } = this;
      let { currentDropIndex } = drag;

      let width = 6;
      if (currentDropIndex === drag.dragColumnIndex + 1) {
        currentDropIndex = drag.dragColumnIndex;
      }

      let widthIndex = firstContentColumn + currentDropIndex;

      let left = sum(drag.widths.slice(0, widthIndex)) - drag.scrollX;
      if (currentDropIndex === drag.dragColumnIndex) {
        width = drag.widths[widthIndex];
      } else if (widthIndex === drag.widths.length) {
        left -= width;
      } else if (widthIndex > 0) {
        left -= width / 2;
      }

      return {
        left: `${left}px`,
        width: `${width}px`,
      };
    },

    colWidths(): string[] {
      const defaultWidth = this.fixed ? '150px' : 'auto';
      return this.columns.map(column => (
        column.width != null ? `${column.width}px` : defaultWidth
      ));
    },

    topSpacerRows(): number {
      return this.offset;
    },

    bottomSpacerRows(): number {
      const startRow = this.offset + this.items.length;
      return this.total == null ? 1 : this.total - startRow;
    },

    hasSelection(): boolean {
      return (
        this.internalSelection.inverted ||
        this.internalSelection.selected.length !== 0
      );
    },

    activeRow: {
      get(): string | null {
        return this.internalSelection.active;
      },

      set(val: string | null) {
        this.internalSelection = {
          ...this.internalSelection,
          active: val,
        };
      },
    },
  },

  methods: {
    noop() {},

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

      if (this.stickyColumn && index === 0) { index = 1; }

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

    isChecked(node: ITableNode): boolean {
      return (
        this.internalSelection.selected.includes(node.key) !==
        this.internalSelection.inverted
      );
    },

    toggleChecked(node: ITableNode) {
      let { selected } = this.internalSelection;
      if (selected.includes(node.key)) {
        selected = selected.filter(k => k !== node.key);
      } else {
        selected = selected.concat(node.key);
      }

      this.internalSelection = {
        ...this.internalSelection,
        selected,
      };
    },

    selectAll() {
      this.internalSelection = {
        ...this.internalSelection,
        inverted: true,
        selected: [],
      };
    },

    selectNone() {
      this.internalSelection = {
        ...this.internalSelection,
        inverted: false,
        selected: [],
      };
    },

    onClick(event: UIEvent, node: ITableNode) {
      this.activeRow = node.key;
      if (this.checkable && (this.hasSelection || event.detail > 1)) {
        this.toggleChecked(node);
      }
    },

    onCtrlClick(node: ITableNode) {
      if (this.checkable) {
        this.toggleChecked(node);
      }
      this.activeRow = node.key;
    },

    onShiftClick(node: ITableNode) {
      if (this.checkable) {
        if (this.activeRow) {
          const activeIndex = this.rootNodes.findIndex(n => n.key === this.activeRow);
          const newIndex = this.rootNodes.indexOf(node);
          if (activeIndex === -1 || newIndex === -1) return;

          const start = Math.min(activeIndex, newIndex);
          const stop = Math.max(activeIndex, newIndex);

          const selected = this.rootNodes.slice(start, stop + 1).map(n => n.key);

          this.internalSelection = {
            ...this.internalSelection,
            inverted: false,
            selected,
          };
        }
      }
    },

    onMouseDown(event: PointerEvent, index: number) {
      event.preventDefault();

      clearTimeout(this.moveTimeoutId);

      // Prevent moving sticky column
      if (this.stickyColumn && index === 0) return;

      this.moveTimeoutId = window.setTimeout(() => {
        let el = event.target as HTMLElement;

        let tr = el.closest('tr') as HTMLElement;
        if (tr === null) return;

        let root = tr.closest('.s-table__wrapper') as HTMLElement;
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
      if (to === from) return;

      // TODO sync
      this.$emit('move-column', { from, to });
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

      let { scrollTop } = element;
      let scrollBottom = element.scrollTop + element.clientHeight;

      const bottomSpacer = this.$refs['bottom-spacer'] as HTMLElement;
      if (bottomSpacer) {
        const spacerPos = bottomSpacer.offsetTop;
        if (spacerPos < scrollBottom) {
          const spacerOffset = Math.max(0, scrollTop - spacerPos);
          const rowOffset = Math.floor(spacerOffset / this.rowHeight);

          const rows = Math.ceil((scrollBottom - spacerPos) / this.rowHeight) - rowOffset;

          let firstRow = this.offset + this.rootNodes.length + rowOffset;
          let lastRow = firstRow + rows;

          const args = { firstRow, lastRow };
          this.$emit('visible-rows', args);
        }
      }

      const topSpacer = this.$refs['top-spacer'] as HTMLElement;
      if (topSpacer) {
        const spacerPos = topSpacer.offsetTop;
        if (spacerPos > scrollTop) {
          const spacerOffset = Math.max(0, spacerPos - scrollBottom);
          const rowOffset = Math.floor(spacerOffset / this.rowHeight);

          const rows = Math.ceil((spacerPos - scrollTop) / this.rowHeight) - rowOffset;

          let lastRow = this.offset - rowOffset;
          let firstRow = Math.floor(scrollTop / this.rowHeight);

          const args = { firstRow, lastRow };
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

    getNodes(parent: ITableNode | null, items: IItem[]): ITableNode[] {
      const keyPath = parent != null ? parent.keyPath : [];
      return items.reduce((value: ITableNode[], item: IItem, i: number): ITableNode[] => {
        const itemKeyPath = keyPath.concat(item.key);
        const node: ITableNode = {
          key: joinKeyPath(itemKeyPath),
          keyPath: itemKeyPath,
          parent,
          item,
          isLastChild: i === items.length - 1,
          hasSubItems: !!(item.subItems && item.subItems.length),
          hasPendingSubItems: item.subItems === null,
        };

        let newValue = value.concat(node);
        if (item.subItems && this.isOpen(node)) {
          newValue = newValue.concat(this.getNodes(node, item.subItems));
        }
        return newValue;
      }, []);
    },

    // TODO
    renderPlaceholders(startRow: number, rows: number): VNode[] {
      if (rows === 0) return [];

      const h = this.$createElement;

      const nodes: VNode[] = [];

      for (let i = 0; i < rows; i++) {
        const row = startRow + i;
        const el = h('tr', {
          key: row,
        }, [
          this.columns.map((column, index) => h('td', {
            key: column.key,
            class: this.getColumnClass(column, index),
          }, [
            h('span', { staticClass: 's-table__cell-wrapper' }, [
              h('span', { staticClass: 's-table__cell-content' }, [
                h('span', {
                  staticClass: 's-table__cell-placeholder',
                  style: { width: `${hash(row, index) + 20}px` },
                }),
              ]),
            ]),
          ])),
        ]);
        nodes.push(el);
      }

      return nodes;
    },

    getSpacerHeight(rows: number): string {
      return `${rows * this.rowHeight}px`;
    },

    getHeaderListeners(column: IColumn, index: number) {
      let on: { [key: string]: any } = {};

      if (column.sortable) {
        on.click = (event: MouseEvent) => this.$emit('sort', column.key);
      }

      if (this.draggable) {
        on.pointerdown = (event: PointerEvent) => this.onMouseDown(event, index);
        on.pointerup = this.onMouseUp;
        on.pointermove = this.onPointerMove;
        on.pointerout = this.onPointerOut;
      }

      return on;
    },

    getColumnClass(column: IColumn, index: number) {
      return this.classes('col', {
        sticky: index === 0 && this.stickyColumn,
        dragging: this.isDragging(index),
        right: column.align === 'right',
        center: column.align === 'center',
      });
    },

    getCellValue(node: ITableNode, column: IColumn) {
      let value = get(node.item.data, column.key);
      if (column.filter) {
        value = column.filter(value);
      }
      return value;
    },

    isDragging(index: number): boolean {
      if (this.drag === null) return false;
      return index === this.drag.dragColumnIndex;
    },
  },

  created() {
    this.debounceOnScroll = debounce(this.onScroll, SCROLL_DEBOUNCE);
  },

  beforeDestroy(this: any) {
    clearTimeout(this.moveTimeoutId);
  },
});
</script>
