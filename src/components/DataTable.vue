<template>
  <div class="flex-column flex-grow">
    <data-table-internal
      class="flex-grow"
      :items="items"
      :columns="dataSource.columns"
      :sorting="sorting"
      @sort="onSort"
      @scrollBottom="fetchMore"

      v-bind="$attrs"
    >

      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope"><slot :name="slot" v-bind="scope"/></template>

    </data-table-internal>

    <div class="flex-row flex-end">
      <Button @click="pdfExport">PDF</Button>
        &nbsp;
      <Button @click="excelExport">XLS</Button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Button from './Button.vue';
import DataTableInternal from './DataTableInternal.vue';
import { IDataSource, ISortState, IItem } from './types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export { IDataSource, IColumn, ISortState, IItem, FetchData } from './types';

export default Vue.extend({
  name: 'data-table',
  inheritAttrs: false,

  props: {
    dataSource: Object as () => IDataSource,
  },

  components: {
    Button,
    DataTableInternal,
  },

  data() {
    return {
      sorting: {
        key: null,
        reverse: false,
      } as ISortState,
      items: [] as IItem[],
    };
  },

  methods: {
    async load() {
      this.items = await this.dataSource.fetch(0, this.sorting);
    },

    async fetchMore() {
      let items = await this.dataSource.fetch(this.items.length, this.sorting);
      this.items = this.items.concat(items);
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
      let src = this.dataSource;
      let columns = src.columns
        .filter((c: any) => c.export !== false)
        .map(({key, title}: any) => ({
          dataKey: key,
          title,
        }));

      let items: IItem[] = [];
      while (true) {
        let more = await src.fetch(items.length, this.sorting);
        if (more.length === 0)
          break;
        items = items.concat(more);
      }

      let doc = new jsPDF({
        orientation: 'landscape',
      });

      (doc as any).autoTable(columns, items, {
        margin: 5,
      });

      doc.save('table.pdf');
    },

    async excelExport() {
      console.warn('Oink oink');
    },
  },

  watch: {
    dataSource: {
      handler() {
        this.sorting = {key: null, reverse: false};
        this.items = [];
        this.load();
      },
      immediate: true,
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

