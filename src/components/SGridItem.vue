<template>
  <div :class="itemClass">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SGridItem',

  inject: ['$validator'],

  props: {
    span: {
      type: [Number, String],
      default: 1,
    },
  },

  computed: {
    itemClass() {
      return this.$class({
        [`span-${this.span}`]: true,
      });
    },
  },
});
</script>
