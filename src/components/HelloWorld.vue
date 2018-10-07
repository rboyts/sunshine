<template>
  <div class="container">
    <div class="options">
      <label>Data source:</label>
      <select v-model="tab">
        <option v-for="(source, key) in sources" :key="key" :value="key">{{ source.label }}</option>
      </select>

      <label>
        <input type="checkbox" v-model="draggable">
        Draggable columns
      </label>
    </div>

    <data-table :columns="columns" :items="items" :draggable="draggable" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from './DataTable.vue';

const DataSources = {
  'users': {
    label: 'Users',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'username', label: 'User name' },
      { key: 'company', label: 'Company' },
      { key: 'email', label: 'Email' },
      { key: 'suite', label: 'Suite' },
      { key: 'street', label: 'Street' },
      { key: 'zipcode', label: 'Zip-code' },
      { key: 'city', label: 'City' },
      { key: 'phone', label: 'Phone' },
      { key: 'website', label: 'Website' },
    ],
    fetch: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      return data.map((u: any) => ({
        ...u,
        ...u.address,
        company: u.company.name,
      }));
    },
  },

  'github-repos': {
    label: 'Github Repos',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'stargazers_count', label: 'Stars' },
      { key: 'language', label: 'Language' },
      { key: 'full_name', label: 'Full name' },
      { key: 'homepage', label: 'Homepage' },
      { key: 'size', label: 'Size' },
      { key: 'description', label: 'Description' },
    ],
    fetch: async () => {
      const res = await fetch('https://api.github.com/users/vim-scripts/repos?page=0&per_page=100');
      return await res.json();
    },
  },
};

export default Vue.extend({
  name: 'HelloWorld',

  components: {
    DataTable,
  },

  data() {
    return {
      tab: 'users',
      draggable: true,
      sources: DataSources,
      items: [],
      columns: [],
    };
  },

  methods: {
    async load(key: string) {
      let source = this.sources[key];

      let items = await source.fetch();
      this.items = items;
      this.columns = source.columns;
    },
  },

  watch: {
    tab(val) {
      this.load(val);
    },
  },

  async mounted() {
    this.load(this.tab);
  },
});
</script>

<style scoped lang="scss">
select, option {
  margin: 0 10px;
  padding: 8px 16px;
  border-radius: 3px;
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
