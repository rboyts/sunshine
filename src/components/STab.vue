<template>
  <router-link :class="classes('link')" :to="to"><slot /></router-link>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
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
