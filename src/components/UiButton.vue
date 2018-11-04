<template>
  <button :class="buttonClass" :disabled="inactive" v-on="$listeners">
    <span :class="contentClass" tabindex="-1">
      <slot name="left" />
      <span style="flex: 1">
        <slot />
      </span>
      <slot name="right" />
    </span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
import { generate } from '@/lib/utils';

export default Vue.extend({
  name: 'ui-button',
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
      return generate('ui-btn').gen({ small: this.small });
    },

    contentClass(): object {
      return generate('ui-btn')
        .elem('content')
        .gen({
          main: this.primary,
          secondary: !this.primary,
          inactive: this.inactive,
        });
    },
  },
});
</script>
