<template>
  <s-table
    class="flex-grow"
    :items="items"
    :total="total"
    :offset="offset"
    :sorting="sorting"
    :columns="columns"
    :checkable="checkable"
    :selection.sync="selection"
    :columns-state.sync="columnsState"
    @sort="onSort"
    @visible-rows="onVisibleRows"
    @open-item="onOpenItem"

    v-bind="$attrs"
  >
    <!-- Pass on all slots -->
    <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </s-table>
</template>

<script lang="ts">
import Vue from 'vue';
import STable from './STable.vue';
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
  name: 's-table-vuex-wrapper',
  inheritAttrs: false,

  components: {
    STable,
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
      'columnsState',
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
    getState(this: any, key: string): any {
      return this.$store.getters[`${this.module}/${key}`];
    },

    dispatchAction(this: any, name: string, payload?: any) {
      this.$store.dispatch(`${this.module}/${name}`, payload);
    },

    commitMutation(this: any, name: string, payload?: any) {
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
