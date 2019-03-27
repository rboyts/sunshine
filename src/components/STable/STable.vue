<template>
  <s-table-internal
    class="flex-grow"
    :items="items"
    :total="total"
    :offset="offset"
    :sorting="sorting"
    :columns="visibleColumns"
    :orderedColumns="orderedColumns"
    :checkable="checkable"
    :selection.sync="selection"
    @sort="onSort"
    @visible-rows="onVisibleRows"
    @move-column="onMoveColumn"
    @open-item="onOpenItem"
    @toggleColumn="onToggleColumn"

    v-bind="$attrs"
  >

    <!-- Pass on all slots -->
    <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>

  </s-table-internal>
</template>

<script lang="ts">
import Vue from 'vue';
import STableInternal from './STableInternal.vue';
import {
  ISortState, IItem, IColumn, IRequestLoadItemsPayload, IOrderedColumn,
} from '../types';

const connectToStore = (key: string) => ({
  get(this: any) {
    return this.getState(key);
  },

  set(this: any, value: any) {
    return this.commitMutation(key, value);
  },
});

const mapToStore = (keys: string[]) => {
  const mapped: {[key: string]: any} = {};
  for (const key of keys) {
    mapped[key] = connectToStore(key);
  }
  return mapped;
};

export default Vue.extend({
  name: 's-table',
  inheritAttrs: false,

  components: {
    STableInternal,
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

    offset(): number {
      return this.getState('offset');
    },

    total(): number {
      return this.getState('total');
    },

    sorting(): ISortState {
      return this.getState('sorting');
    },

    ...mapToStore([
      'selection',
    ]),
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

    onVisibleRows(args: IRequestLoadItemsPayload) {
      this.dispatchAction('requestLoadItems', args);
    },

    onOpenItem(keyPath: string) {
      this.dispatchAction('requestLoadSubItems', { keyPath });
    },

    onSort(key: string) {
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
