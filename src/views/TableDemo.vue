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
      this.items = await this.dataSource.fetch(0, 50, this.sorting);
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
      type Range = [number, number];

      let has: Range = [this.skip, this.skip + this.items.length];
      let needs: Range = [args.firstRow, args.lastRow + 1];

      if (has[0] <= needs[0] && has[1] >= needs[1])
        return;

      const chunkSize = 50;

      let needChunks = [Math.floor(needs[0] / chunkSize) * chunkSize, Math.ceil(needs[1] / chunkSize) * chunkSize];

      let prepend: Range | null = null;
      let append: Range | null = null;
      if (needs[0] < has[0]) {
        prepend = [needChunks[0], has[0]];
      }
      if (needs[1] > has[1]) {
        append = [has[1], needChunks[1]];
      }

      console.log('has', has[0], has[1]);
      console.log('needs', needs[0], needs[1]);
      if (prepend !== null) console.log('prepend', prepend[0], prepend[1]);
      if (append !== null) console.log('append', append[0], append[1]);

      this.isLoading = true;

      if (prepend !== null) {
        let skip = prepend[0];
        let take = prepend[1] - prepend[0];
        let newItems = await this.dataSource.fetch(skip, take, this.sorting);
        this.skip = skip;
        this.items = newItems.concat(this.items);
      }

      if (append !== null) {
        let skip = append[0];
        let take = append[1] - append[0];
        // skip = Math.max(skip, this.skip + this.items.length);
        let newItems = await this.dataSource.fetch(skip, take, this.sorting);
        this.items = this.items.concat(newItems);
      }

      this.total = this.dataSource.count;
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
