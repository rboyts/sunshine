<template>
  <div id="app">
    <h1>Components demo page</h1>

    <ui-tabs>
      <ui-tab to="/">{{ home }}</ui-tab>
      <ui-tab to="/accordion">Accordion</ui-tab>
      <ui-tab to="/table">DataTable</ui-tab>
      <ui-tab to="/chart">DataChart</ui-tab>
      <ui-tab to="/calendar">Calendar</ui-tab>
    </ui-tabs>

    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiTabs from '@/components/UiTabs.vue';
import UiTab from '@/components/UiTab.vue';

export default Vue.extend({
  components: {
    UiTabs,
    UiTab,
  },

  data() {
    return {
      home: 'Basic components',
    };
  },
})
</script>


<style lang="scss">
#app {
  box-sizing: border-box;
  padding: 10px 60px;
  height: calc(100vh - 80px);
}
</style>
