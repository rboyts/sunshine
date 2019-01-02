<template>
  <button :class="classes(buttonOptions)" :disabled="inactive" v-on="$listeners">
    <span class="inline-flex" :class="classes('content', contentOptions)" tabindex="-1">
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
    buttonOptions(): object {
      return {
        small: this.small,
      };
    },

    contentOptions(): object {
      return {
        main: this.primary,
        secondary: !this.primary,
        inactive: this.inactive,
      };
    },
  },
});
</script>
