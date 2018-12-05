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

      <div slot="menu" style="padding: .5rem; white-space: nowrap">
        <div v-for="oc in orderedColumns" :key="oc.key" >
          <ui-checkbox v-model="oc.visible">{{ oc.key }}</ui-checkbox>
        </div>
      </div>

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
import UiMenu from './UiMenu.vue';
import UiButton from './UiButton.vue';
import UiCheckbox from './UiCheckbox.vue';
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
// `available columns`:
//   - As prop
//   - Default order
//   - [optional] Default visible/hidden
// `ordered columns`:
//   - Must contain all available, even hidden
//   - Array of keys only?
// `visible map`:
//   - Object with key -> bool pairs
// `visible columns`:
//   - Ordered list of only currently visible
//   - Column objects
//   - Computed from all of the above
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
  name: 'ui-data-table',
  inheritAttrs: false,

  components: {
    UiMenu,
    UiButton,
    UiCheckbox,
    DataTableInternal,
  },

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

  data() {
    return {
      menuOpen: false,
      sorting: {
        key: null,
        reverse: false,
      } as ISortState,

      orderedColumns: [] as Array<{key: string, visible: boolean}>,
      visibleColumns: {} as {[key: string]: boolean},
    };
  },

  computed: {
    activeColumns(): IColumn[] {
      return this.orderedColumns
        .filter(oc => oc.visible)
        .map(oc => {
          let col = this.columns.find(c => c.key === oc.key);
          if (!col) throw new Error('Column not found');
          return col;
        });
    },
  },

  watch: {
    columns: {
      handler() {
        this.orderedColumns = this.columns.map(c => ({key: c.key, visible: true}));
        // this.visibleColumns = this.columns.reduce((obj: {[key: string]: boolean}, col: IColumn) => {
        //   obj[col.key] = true;
        //   return obj;
        // }, {});
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
      const fromKey = this.activeColumns[from].key;
      const fromIndex = this.orderedColumns.findIndex(oc => oc.key === fromKey);

      let toIndex: number;
      if (to === 0) {
        toIndex = 0;
      } else {
        const afterKey = this.activeColumns[to - 1].key;
        toIndex = this.orderedColumns.findIndex(oc => oc.key === afterKey) + 1;
      }

      const moved = this.orderedColumns.splice(fromIndex, 1);
      this.orderedColumns.splice(toIndex, 0, ...moved);
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

      let data = this.items.map(i => i.data);

      (doc as any).autoTable(columns, data, {
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
