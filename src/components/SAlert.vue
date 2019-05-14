<template>
  <div :class="$class(alertOptions)">
    <div :class="$class('status', alertOptions)" />

    <div :class="$class('content')">
      <slot name="icon">
        <s-icon
          v-if="icon"
          :name="icon"
        />
        <s-progress v-else-if="progress" />
      </slot>

      <div :class="$class('main')">
        <slot />
      </div>

      <div :class="$class('buttons')">
        <slot name="buttons" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SAlert',

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
    progress: {
      type: Boolean,
      default: false,
    },

    icon: {
      type: String,
      default: undefined,
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
