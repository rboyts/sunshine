<template>
  <button :class="classes" v-on="$listeners">
    <slot />
    <span style="float: right">
      <slot name="right" />
    </span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-button',
  inheritAttrs: true,

  props: {
    small: {
      type: Boolean,
      default: false,
    },
    secondary: {
      type: Boolean,
      default: false,
    },
    inactive: {
      typy: Boolean,
      default: false,
    },
  },

  computed: {
    main(): boolean {
      return !this.secondary;
    },

    classes(): any {
      return {
        'ui-btn': true,
        'ui-btn--main': this.main,
        'ui-btn--secondary': this.secondary,
        'ui-btn--inactive': this.inactive,
        'ui-btn--small': this.small,
      };
    },
  },
});
</script>
