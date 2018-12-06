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
        <ui-menu v-model="menuOpen">
          <div slot="activator" style="width: 2.5rem">
            <i class="fas fa-ellipsis-h" />
          </div>

          <div slot="content" style="padding: .5rem; white-space: nowrap">
            <div v-for="oc in orderedColumns" :key="oc.column.key" >
              <ui-checkbox v-model="oc.visible">{{ oc.column.title }}</ui-checkbox>
            </div>
          </div>
        </ui-menu>
      </template>

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

    async pdfExport() {
      let columns = this.visibleColumns
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
