<template>
  <div id="app">
    <h1>Components demo page</h1>

    <div class="ui-tabs">
      <router-link to="/">Basic components</router-link>
      <router-link to="/accordion">Accordion</router-link>
      <router-link to="/table">DataTable</router-link>
      <router-link to="/chart">DataChart</router-link>
      <router-link to="/calendar">Calendar</router-link>
    </div>

    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  box-sizing: border-box;
  padding: 10px 60px;
  height: calc(100vh - 80px);
}
</style>
