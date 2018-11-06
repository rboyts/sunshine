<template>
  <div class="container">
    <div class="options">

      <label>Data source:</label>&nbsp;
      <ui-select v-model="dataSource" :items="sources" label="Data source" />&nbsp;

      <ui-checkbox v-model="draggable">Draggable columns</ui-checkbox>&nbsp;
      <ui-checkbox v-model="condensed">Condensed</ui-checkbox>&nbsp;
    </div>

    <ui-data-table
      :columns="dataSource.columns"
      :items="items"
      :total="total"
      :skip="skip"
      :draggable="draggable"
      :condensed="condensed"
      @visible-rows="onVisibleRows"
    >


      <!-- Override cell to show email address as link -->
      <td slot="~email" slot-scope="{ value }">
        <a :href="'mailto:' + value">{{ value }}</a>
      </td>

      <!-- Override cell to show website as link -->
      <td slot="~website" slot-scope="{ value }">
        <a :href="'http://' + value">{{ value }}</a>
      </td>

      <!-- Override cell to show a button -->
      <td slot="~actions" slot-scope="{ item }">
        <div>
          <ui-button small v-on:click="onEdit(item)">Edit</ui-button>
        </div>
      </td>

      <!-- Override content to show when there is no data -->
      <div slot="empty">
        No data!
      </div>

    </ui-data-table>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from '@/components/UiButton.vue';
import UiCheckbox from '@/components/UiCheckbox.vue';
import UiSelect from '@/components/UiSelect.vue';
import UiDataTable, {
  ISortState,
  IColumn,
  IItem,
} from '@/components/UiDataTable.vue';

import DataSources from './data';

export default Vue.extend({
  name: 'TableDemo',

  components: {
    UiButton,
    UiCheckbox,
    UiSelect,
    UiDataTable,
  },

  data() {
    return {
      dataSource: DataSources[0],
      draggable: false,
      condensed: false,
      sources: DataSources,
      items: [] as IItem[],
      total: null as number | null,
      skip: 0,
      isLoading: false,
      sorting: {
        key: null,
        reverse: false,
      } as ISortState,
    };
  },

  methods: {
    async load() {
      this.isLoading = true;
      this.items = await this.dataSource.fetch(0, this.sorting);
      this.total = this.dataSource.count;
      this.isLoading = false;
    },

    async fetchMore() {
      this.isLoading = true;
      let items = await this.dataSource.fetch(this.items.length, this.sorting);
      this.items = this.items.concat(items);
      this.total = this.dataSource.count;
      this.isLoading = false;
    },

    async onVisibleRows(args: any) {
      console.log(args);
      if (this.skip <= args.firstRow && this.skip + this.items.length >= args.lastRow)
        return;

      const pageSize = 25;

      this.isLoading = true;
      let skip = Math.floor(args.firstRow / pageSize) * pageSize;
      console.log('fetching', args, skip);
      this.items = await this.dataSource.fetch(skip, this.sorting);
      this.total = this.dataSource.count;
      this.skip = skip;
      this.isLoading = false;
    },

    onEdit(item: IItem) {
      console.log('edit', item.name);
    },
  },

  watch: {
    dataSource: {
      handler() {
        // this.sorting = {key: null, reverse: false};
        this.items = [];
        this.load();
      },
      immediate: true,
    },
  },
});
</script>

<style scoped lang="scss">
.options {
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
