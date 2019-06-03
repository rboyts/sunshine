<template>
  <div
    v-if="visible"
    :class="$class('wrapper')"
    @click.self="close"
  >
    <div :class="$class({ visible })">
      <div :class="$class('header')">
        <span :class="$class('heading')">{{ heading }}</span>
        <s-icon
          @click="close"
          package="sunshine24"
          name="close"
        />
      </div>
      <form
        v-bind="$attrs"
        v-on="$listeners"
      >
        <slot v-bind="{ close }" />
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SDialog',
  inheritAttrs: false,

  model: {
    prop: 'visible',
    event: 'toggle',
  },

  props: {
    visible: {
      type: Boolean,
      default: true,
    },

    heading: {
      type: String,
      default: '',
    },
  },

  methods: {
    close() {
      this.$emit('toggle', false);
    },

    setFocus() {
      const focusable = this.getDefaultFocusElement();
      if (focusable) {
        focusable.focus();
      }
    },

    getDefaultFocusElement() {
      const el = this.$el.querySelector('.autofocus');
      if (el) return el;

      const focusableSelector = [
        '[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',');

      return this.$el.querySelector(focusableSelector);
    },
  },

  watch: {
    async visible(next, prev) {
      if (next && !prev) {
        await Vue.nextTick();
        this.setFocus();
      }
    },
  },
});
</script>
