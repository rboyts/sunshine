<template>
  <div class="flex-column flex-grow">
    <data-table-internal
      class="flex-grow"
      :items="items"
      :total="total"
      :skip="skip"
      :columns="visibleColumns"
      :sorting="sorting"
      @sort="onSort"
      @visible-rows="onVisibleRows"
      @move-column="onMoveColumn"

      v-bind="$attrs"
    >

      <template slot="menu">
        <s-menu v-model="menuOpen">
          <div slot="activator" style="width: 2.5rem">
            <i class="fas fa-ellipsis-h" />
          </div>

          <template slot="content">
            <s-list>
              <s-list-item v-for="oc in orderedColumns" :key="oc.column.key" checkable v-model="oc.visible">
                {{ oc.column.title }}
              </s-list-item>
            </s-list>
          </template>
        </s-menu>
      </template>

      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>

    </data-table-internal>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SMenu from './SMenu.vue';
import SButton from './SButton.vue';
import SCheckbox from './SCheckbox.vue';
import SList from './SList.vue';
import SListItem from './SListItem.vue';
import DataTableInternal from './internal/DataTableInternal';
import { ISortState, IItem, IColumn } from './types';

export { IColumn, ISortState, IItem, FetchData } from './types';


// API
//
// Props:
//   columns: Ordered list of column objects (model?, sync?)
//   items: Loaded data
//   total: Total number of rows in data-set (null means unknown/unbound)
//   skip: Current offset in the data-set of the first row (default: 0)
//
// Events:
//   update:columns ?
//   sort -- request data to be sorted (scroll to top?)
//   scroll -- (firstItem, lastItem)
//
// Data structure:
// items: [
//   {
//     // key / values
//     children: ...
//   },
// ]


export default Vue.extend({
  name: 's-data-table',
  inheritAttrs: false,

  components: {
    SMenu,
    SButton,
    SList,
    SListItem,
    SCheckbox,
    DataTableInternal,
  },

  props: {
    columns: Array as () => IColumn[],
    items: Array as () => IItem[],

    isLoading: Boolean,

    total: {
      type: Number as () => number | null,
      default: null,
    },

    skip: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      menuOpen: false,
      sorting: {
        key: null,
        reverse: false,
      } as ISortState,

      orderedColumns: [] as Array<{column: IColumn, visible: boolean}>,
    };
  },

  computed: {
    visibleColumns(): IColumn[] {
      return this.orderedColumns
        .filter(oc => oc.visible)
        .map(oc => oc.column);
    },
  },

  watch: {
    columns: {
      handler() {
        this.orderedColumns = this.columns.map(column => ({column, visible: true}));
      },
      immediate: true,
    },
  },

  methods: {
    onVisibleRows(args: any) {
      this.$emit('visible-rows', args);
    },

    onSort(event: MouseEvent, key: string) {
      if (this.sorting.key === key) {
        this.sorting.reverse = !this.sorting.reverse;
      } else {
        this.sorting.key = key;
        this.sorting.reverse = false;
      }

      this.$emit('sort', this.sorting);
    },

    onMoveColumn({from, to}: {from: number, to: number}) {
      const fromKey = this.visibleColumns[from].key;
      const fromIndex = this.orderedColumns.findIndex(oc => oc.column.key === fromKey);

      let toIndex: number;
      if (to === 0) {
        toIndex = 0;
      } else {
        const afterKey = this.visibleColumns[to - 1].key;
        toIndex = this.orderedColumns.findIndex(oc => oc.column.key === afterKey) + 1;
      }

      const moved = this.orderedColumns.splice(fromIndex, 1);
      this.orderedColumns.splice(toIndex, 0, ...moved);
    },

  },
});
</script>
