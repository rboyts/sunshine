<template>
  <div id="app" class="main-layout">
    <h1>Components demo page</h1>

    <ui-tabs v-if="tabs">
      <ui-tab to="/">{{ home }}</ui-tab>
      <ui-tab to="/accordion">Accordion</ui-tab>
      <ui-tab to="/table">DataTable</ui-tab>
      <ui-tab to="/chart">DataChart</ui-tab>
      <ui-tab to="/calendar">Calendar</ui-tab>
    </ui-tabs>

    <div class="main">
      <router-view/>
    </div>
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
      tabs: true,
      home: 'Basic components',
    };
  },
});
</script>


<style lang="scss" scoped>
.main-layout {
  box-sizing: border-box;
  padding: 10px 60px 25px 60px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  overflow: auto;
}
</style>
