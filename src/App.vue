<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">DataTable</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  box-sizing: border-box;
  padding: 60px;
  height: 100vh;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e8e8e8;
}

#nav {
  margin-bottom: 40px;
}
</style>
