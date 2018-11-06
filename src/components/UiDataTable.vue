<template>
  <div class="flex-column flex-grow">
    <data-table-internal
      class="flex-grow"
      :items="items"
      :total="total"
      :skip="skip"
      :columns="columns"
      :sorting="sorting"
      @sort="onSort"
      @scroll-bottom="onScrollBottom"

      v-bind="$attrs"
      v-on="$listeners"
    >

      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>

    </data-table-internal>

    <div class="flex-row flex-end">
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
    };
  },

  methods: {
    onScrollBottom() {
      if (!this.isLoading) {
        this.fetchMore();
      }
    },

    onSort(event: MouseEvent, key: string) {
      if (this.sorting.key === key) {
        this.sorting.reverse = !this.sorting.reverse;
      } else {
        this.sorting.key = key;
        this.sorting.reverse = false;
      }

      this.load();
    },

    async pdfExport() {
      // let src = this.dataSource;
      // let columns = src.columns
      //   .filter((c: any) => c.export !== false)
      //   .map(({key, title}: any) => ({
      //     dataKey: key,
      //     title,
      //   }));

      // let items: IItem[] = [];
      // while (true) {
      //   let more = await src.fetch(items.length, this.sorting);
      //   if (more.length === 0)
      //     break;
      //   items = items.concat(more);
      // }

      // let doc = new jsPDF({
      //   orientation: 'landscape',
      // });

      // (doc as any).autoTable(columns, items, {
      //   margin: 5,
      // });

      // doc.save('table.pdf');
    },

    async excelExport() {
      console.warn('Oink oink');
    },
  },
});
</script>


<style lang="scss" scoped>
.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-grow {
  flex: 1
}

.flex-end {
  justify-content: flex-end;
}
</style>

