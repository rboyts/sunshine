<template>
  <button :class="buttonClasses" :disabled="inactive" v-on="$listeners">
    <span :class="contentClasses" tabindex="-1">
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
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
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
    buttonClasses(): object {
      return this.classes({
        small: this.small,
      });
    },

    contentClasses(): object {
      return this.classes('content', {
        main: this.primary,
        secondary: !this.primary,
        inactive: this.inactive,
      });
    },
  },
});
</script>
