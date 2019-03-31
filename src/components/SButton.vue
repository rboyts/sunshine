<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="inactive"
    v-on="$listeners"
  >
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

    danger: {
      type: Boolean,
      default: false,
    },

    inactive: {
      type: Boolean,
      default: false,
    },

    submit: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    type(): string {
      return this.submit ? 'submit' : 'button';
    },

    buttonClasses(): object {
      return this.classes({
        small: this.small,
        normal: !this.primary && !this.danger,
        primary: this.primary,
        danger: this.danger,
        inactive: this.inactive,
      });
    },

    contentClasses(): object {
      return this.classes('content', {
      });
    },
  },
});
</script>
