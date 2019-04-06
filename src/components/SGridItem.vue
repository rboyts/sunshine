<template>
  <div :class="itemClass">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';
import { ClassesMixin } from '../lib/utils';

export default Vue.extend({
  name: 'SGridItem',

  inject: ['$validator'],

  mixins: [
    ClassesMixin,
  ],

  props: {
    span: {
      type: [Number, String],
      default: 1,
    },
  },

  computed: {
    itemClass() {
      return this.classes({
        [`span-${this.span}`]: true,
      });
    },
  },
});
</script>
