<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Inputs</router-link> |
      <router-link to="/table">DataTable</router-link> |
      <router-link to="/chart">DataChart</router-link> |
      <router-link to="/calendar">Calendar</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  box-sizing: border-box;
  padding: 10px 60px;
  height: calc(100vh - 40px);
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e8e8e8;
}
</style>
