<template>
  <router-link :class="classes('link')" :to="to"><slot /></router-link>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-tab',

  props: {
    to: String,
  },

  watch: {
    $route: {
      handler(route) {
        if (route.path === this.to) {
          (this.$parent as any).setActiveTab(this);
        }
      },
      immediate: true,
    },
  },
});
</script>
