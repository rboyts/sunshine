<template>
  <div>
    <h2>Data chart demo</h2>

    <data-chart :size="size" :data="data" />
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import DataChart from '@/components/DataChart.vue';

export default Vue.extend({
  components: {
    DataChart,
  },

  data() {
    return {
      data: [],
      size: 200,
    };
  },

  methods: {
    async fetchData() {
      const res = await fetch('https://api.github.com/users/vim-scripts/repos?page=0&per_page=8');
      let rawData = await res.json();

      this.data = rawData.map((d: any) => ({
        label: d.name,
        value: d.size,
      }));
    },
  },

  mounted() {
    this.fetchData();
  },
});
</script>
