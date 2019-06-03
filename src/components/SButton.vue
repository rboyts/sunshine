<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="inactive"
    v-on="$listeners"
  >
    <span
      :class="contentClasses"
      tabindex="-1"
    >
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

export default Vue.extend({
  name: 'SButton',
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

    round: {
      type: Boolean,
      default: false,
    },

    square: {
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

    autofocus: {
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
      return this.$class({
        small: this.small,
        round: this.round,
        square: this.square,
        normal: !this.primary && !this.danger,
        primary: this.primary,
        danger: this.danger,
        inactive: this.inactive,
      });
    },

    contentClasses(): any {
      return [
        this.$class('content', {}),
        {
          autofocus: this.autofocus,
        },
      ];
    },
  },
});
</script>
