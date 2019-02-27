<template>
  <s-table-internal
    class="flex-grow"
    ref="impl"
    :items="items"
    :total="total"
    :offset="offset"
    :sorting="sorting"
    :columns="visibleColumns"
    :checkable="checkable"
    :selectedItems="selectedItems"
    :invertSelection="invertSelection"
    @sort="onSort"
    @visible-rows="onVisibleRows"
    @move-column="onMoveColumn"
    @open-item="onOpenItem"
    @toggle-item="onToggleItem"

    v-bind="$attrs"
  >

    <template v-slot:menu>
      <s-table-options-menu
        :checkable="checkable"
        :orderedColumns="orderedColumns"
        @selectAll="onSelectAll"
        @selectNone="onSelectNone"
        @toggleColumn="onToggleColumn"
      />
    </template>

    <!-- Pass on all slots -->
    <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>

  </s-table-internal>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../../lib/utils';
import SButton from '../SButton.vue';
import SIcon from '../SIcon.vue';
import STableInternal from './STableInternal.vue';
import STableOptionsMenu from './STableOptionsMenu.vue';
import {
  ISortState, IItem, IColumn, IRequestLoadItemsPayload, IOrderedColumn, IColumns,
} from '../types';

export default mixins(ClassesMixin).extend({
  name: 's-table',
  inheritAttrs: false,

  components: {
    SButton,
    SIcon,
    STableInternal,
    STableOptionsMenu,
  },

  props: {
    module: {
      type: String,
      required: true,
    },

    checkable: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    visibleColumns(): IColumn[] {
      return this.getState('visibleColumns');
    },

    orderedColumns(): IOrderedColumn[] {
      return this.getState('orderedColumns');
    },

    columns(): IColumn[] {
      return this.getState('columns');
    },

    items(): IItem[] {
      return this.getState('items');
    },

    selectedItems(): string[] {
      return this.getState('selectedItems');
    },

    invertSelection(): boolean {
      return this.getState('invertSelection');
    },

    offset(): number {
      return this.getState('offset');
    },

    total(): number {
      return this.getState('total');
    },

    sorting(): ISortState {
      return this.getState('sorting');
    },
  },

  watch: {
    module: {
      handler() {
        this.dispatchAction('init');
      },
      immediate: true,
    },
  },

  methods: {
    getState(key: string): any {
      return this.$store.getters[`${this.module}/${key}`];
    },

    dispatchAction(name: string, payload?: any) {
      this.$store.dispatch(`${this.module}/${name}`, payload);
    },

    commitMutation(name: string, payload?: any) {
      this.$store.commit(`${this.module}/${name}`, payload);
    },

    onSelectAll() {
      this.commitMutation('selectAll');
    },

    onSelectNone() {
      this.commitMutation('selectNone');
    },

    onVisibleRows(args: IRequestLoadItemsPayload) {
      this.dispatchAction('requestLoadItems', args);
    },

    onOpenItem(keyPath: string) {
      this.dispatchAction('requestLoadSubItems', { keyPath });
    },

    onToggleItem(key: string) {
      this.commitMutation('toggleItem', key);
    },

    onSort(event: MouseEvent, key: string) {
      this.dispatchAction('sort', key);
    },

    onMoveColumn({ from, to }: {from: number, to: number}) {
      this.dispatchAction('moveColumn', { from, to });
    },

    onToggleColumn({ index, checked }: any) {
      this.commitMutation('toggleColumn', { index, checked });
    },
  },
});
</script>
