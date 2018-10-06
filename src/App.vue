<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'app',
  components: {
    HelloWorld,
  },
});
</script>

<style lang="scss">
#app {
  box-sizing: border-box;
  padding: 60px;
  height: 100vh;
}

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e8e8e8;
}
</style>
