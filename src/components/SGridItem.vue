<template>
  <div :class="itemClass">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '../lib/utils';

const itemClassHelper = classHelper('grid-item');

export default Vue.extend({
  name: 's-grid-item',

  props: {
    span: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    itemClass(): object {
      return itemClassHelper({
        [`span-${this.span}`]: true,
      });
    },
  },
});
</script>
