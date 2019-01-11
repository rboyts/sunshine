<template>
  <div :class="classes(alertOptions)">
    <div :class="classes('status', alertOptions)" />

    <div :class="classes('content')">
      <div :class="classes('main')">
        <slot />
      </div>

      <div :class="classes('buttons')">
        <slot name="buttons" />
      </div>
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

