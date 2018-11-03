<template>
  <button :class="classes" :disabled="inactive" v-on="$listeners">
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
    classes(): any {
      return {
        'ui-btn': true,
        'ui-btn--main': this.primary,
        'ui-btn--secondary': !this.primary,
        'ui-btn--inactive': this.inactive,
        'ui-btn--small': this.small,
      };
    },
  },
});
</script>
