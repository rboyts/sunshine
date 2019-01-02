<template>
  <div :class="classes(alertOptions)">
    <div class="s-alert__main">
      <slot />
    </div>

    <div class="s-alert__buttons">
      <slot name="buttons" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-alert',

  props: {
    success: {
      type: Boolean,
      default: false,
    },
    warning: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    alertOptions(): object {
      return {
        success: this.success,
        warning: this.warning,
        error: this.error,
      };
    },
  },
});
</script>

