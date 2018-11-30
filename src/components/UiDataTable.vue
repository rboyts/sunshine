<template>
  <div class="flex-column flex-grow">
    <data-table-internal
      class="flex-grow"
      :items="items"
      :total="total"
      :skip="skip"
      :columns="activeColumns"
      :sorting="sorting"
      @sort="onSort"
      @visible-rows="onVisibleRows"
      @move-column="onMoveColumn"

      v-bind="$attrs"
    >

      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>

    </data-table-internal>

    <!-- XXX Hard-coded height here, because there is some unresolved flexbox issue -->
    <div class="flex-row flex-end" style="min-height: 24px">
      <ui-button small @click="pdfExport">PDF</ui-button>
        &nbsp;
      <ui-button small @click="excelExport">XLS</ui-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from './UiButton.vue';
import DataTableInternal from './internal/DataTableInternal';
import { ISortState, IItem, IColumn } from './types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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


export default Vue.extend({
  name: 'ui-data-table',
  inheritAttrs: false,

  props: {
    // dataSource: Object as () => IDataSource,

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

  components: {
    UiButton,
    DataTableInternal,
  },

  data() {
    return {
      sorting: {
        key: null,
        reverse: false,
      } as ISortState,
      visibleColumns: [] as string[],
    };
  },

  computed: {
    activeColumns(): IColumn[] {
      return this.visibleColumns.map(key => {
        let col = this.columns.find(c => c.key === key);
        if (!col) throw new Error('Column not found');
        return col;
      });
    },
  },

  watch: {
    columns: {
      handler() {
        this.visibleColumns = this.columns.map(c => c.key);
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
      const moved = this.visibleColumns.splice(from, 1);
      this.visibleColumns.splice(to, 0, ...moved);
    },

    async pdfExport() {
      let columns = this.activeColumns
        .filter((c: any) => c.export !== false)
        .map(({key, title}: any) => ({
          dataKey: key,
          title,
        }));

      // FIXME: For this to work properly, we would need to force loading the entire table here.
      // It's probably a better idea to do all exports server-side.

      let doc = new jsPDF({
        orientation: 'landscape',
      });

      (doc as any).autoTable(columns, this.items, {
        margin: 5,
      });

      doc.save('table.pdf');
    },

    async excelExport() {
      console.warn('Oink oink');
    },
  },
});
</script>
