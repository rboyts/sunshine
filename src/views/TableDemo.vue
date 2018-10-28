<template>
  <div class="container">
    <div class="options">

      <label>Data source:</label>
      <ui-select v-model="source" :items="sources" label="Data source" />

      <ui-checkbox v-model="draggable">Draggable columns</ui-checkbox>
    </div>

    <ui-data-table :data-source="source" :draggable="draggable" >

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
        <ui-button small v-on:click="onEdit(item)">Edit</ui-button>
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
  IDataSource,
  FetchData,
} from '@/components/UiDataTable.vue';

type BasicFetch = () => Promise<IItem[]>;

const createBasicSort = (next: BasicFetch): FetchData => (
  async (skip: number, sorting: ISortState) => {
    if (skip > 0) return [];

    let items: IItem[] = await next();

    if (sorting.key === null)
      return items;

    const { key, reverse } = sorting;

    const keyFunc = (item: IItem) => item[key];
    const sortFunc = (a: IItem, b: IItem) => {
      let keyA = keyFunc(a);
      let keyB = keyFunc(b);
      let v = reverse ? 1 : -1;

      switch (true) {
        case keyA < keyB:
          return v;
        case keyA > keyB:
          return -v;
        default:
          return 1;
      }
    };

    return items.slice(skip).sort(sortFunc);
  }
);

const DataSources: {[key: string]: IDataSource} = {
  'users': {
    title: 'Users',
    columns: [
      { key: 'name', title: 'Name', sortable: true },
      { key: 'username', title: 'User name', sortable: true },
      { key: 'company', title: 'Company' },
      { key: 'email', title: 'Email', sortable: true },
      { key: 'suite', title: 'Suite' },
      { key: 'street', title: 'Street' },
      { key: 'zipcode', title: 'Zip-code' },
      { key: 'city', title: 'City' },
      { key: 'phone', title: 'Phone' },
      { key: 'website', title: 'Website' },
      { key: 'actions', title: 'Actions', export: false },
    ],
    fetch: createBasicSort(async (): Promise<IItem[]> => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      return data.map((u: any) => ({
        ...u,
        ...u.address,
        company: u.company.name,
      }));
    }),
  },

  'github-repos': {
    title: 'Github Repos',
    columns: [
      { key: 'full_name', title: 'Full name', sortable: true },
      { key: 'created_at', title: 'Created', sortable: true },
      { key: 'updated_at', title: 'Updated', sortable: true },
      { key: 'name', title: 'Name' },
      { key: 'stargazers_count', title: 'Stars' },
      { key: 'language', title: 'Language' },
      { key: 'homepage', title: 'Homepage' },
      { key: 'size', title: 'Size' },
      { key: 'description', title: 'Description' },
    ],
    fetch: async (skip = 0, sorting: ISortState): Promise<IItem[]> => {
      let direction = sorting.reverse ? 'desc' : 'asc';
      let sort = sorting.key;
      if (sort === 'created_at') sort = 'created';
      if (sort === 'updated_at') sort = 'updated';
      const page = Math.floor(skip / 50);
      let query = `sort=${sort}&direction=${direction}&page=${page}&per_page=50`;
      const res = await fetch(`https://api.github.com/users/vuejs/repos?${query}`);
      return await res.json() as IItem[];
    },
  },

  'empty': {
    title: 'Empty',
    columns: [
      { key: 'id', title: 'Id' },
      { key: 'name', title: 'Name' },
    ],
    fetch: async (): Promise<IItem[]> => [],
  },
};

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
      source: DataSources.users,
      draggable: true,
      sources: DataSources,
    };
  },

  methods: {
    onEdit(item: IItem) {
      console.log('edit', item.name);
    },
  },
});
</script>

<style scoped lang="scss">
select, option {
  margin: 0 10px;
  padding: 8px 16px;
  border-radius: 3px;
  border: 1px solid #999;
  font-size: 14px;
}

.options {
  font-size: 14px;
  margin-bottom: 24px;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
