<template>
  <button :class="buttonClass" :disabled="inactive" v-on="$listeners">
    <span class="inline-flex" :class="contentClass" tabindex="-1">
      <slot name="left" />
      <span class="flex-grow">
        <slot />
      </span>
      <slot name="right" />
    </span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '../lib/utils';

const buttonClassHelper = classHelper('s-btn');
const contentClassHelper = classHelper('s-btn', 'content');

export default Vue.extend({
  name: 's-button',
  inheritAttrs: true,

  props: {
    small: {
      type: Boolean,
      default: false,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    inactive: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    buttonClass(): object {
      return buttonClassHelper({
        small: this.small,
      });
    },

    contentClass(): object {
      return contentClassHelper({
        main: this.primary,
        secondary: !this.primary,
        inactive: this.inactive,
      });
    },
  },
});
</script>
