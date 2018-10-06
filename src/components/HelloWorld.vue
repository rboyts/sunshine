<template>
  <div class="container">
    <div class="options">
      <select v-model="tab">
        <option value="repos">Repositories</option>
        <option value="users">Users</option>
      </select>
    </div>

    <data-table :columns="columns" :items="items" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from './DataTable.vue';

export default Vue.extend({
  name: 'HelloWorld',

  components: {
    DataTable,
  },

  data() {
    return {
      tab: 'repos',
      userColumns: [
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
      reposColumns: [
        { key: 'name', label: 'Name' },
        { key: 'stargazers_count', label: 'Stars' },
        { key: 'language', label: 'Language' },
        { key: 'full_name', label: 'Full name' },
        { key: 'homepage', label: 'Homepage' },
        { key: 'size', label: 'Size' },
        { key: 'description', label: 'Description' },
      ],
      users: [],
      repos: [],
    };
  },

  computed: {
    items(): any[] {
      return this.tab === 'users' ? this.users : this.repos;
    },

    columns(): any[] {
      return this.tab === 'users' ? this.userColumns : this.reposColumns;
    },
  },

  methods: {
    async fetchUsers() {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      this.users = data.map((u: any) => ({
        ...u,
        ...u.address,
        company: u.company.name,
      }));
    },

    async fetchRepos() {
      const res = await fetch('https://api.github.com/users/vim-scripts/repos?page=0&per_page=100');
      this.repos = await res.json();
    },
  },

  async mounted() {
    this.fetchUsers();
    this.fetchRepos();
  },
});
</script>

<style scoped lang="scss">
button {
  padding: 10px 20px;
}

.options {
  margin-bottom: 24px;
}

.container {
  // overflow: hidden;
  // overflow-x: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
