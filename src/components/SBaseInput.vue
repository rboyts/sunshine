<template>
  <div
    :class="inputClass"
    v-on="$listeners"
  >
    <span
      v-if="label"
      :class="labelClass"
    >{{ label }}</span>
    <span
      v-if="maxLength && label"
      :class="counterClass"
    >{{ currentLength }}/{{ maxLength }}</span>
    <slot />
    <div
      v-if="error"
      class="s-input__error"
    >
      {{ error }}
    </div>
    <s-icon
      v-if="error"
      name="warning"
      package="sunshine24"
      :class="warningClass"
    />
    <slot name="right" />
  </div>
</template>

<script>
import Vue from 'vue';
import ClassesMixin from './internal/ClassesMixin';

export default Vue.extend({
  name: 'SInput',

  mixins: [
    ClassesMixin,
  ],

  props: {
    label: {
      type: String,
      default: '',
    },

    error: {
      type: String,
      default: undefined,
    },

    hasFocus: {
      type: Boolean,
      default: false,
    },

    isEmpty: {
      type: Boolean,
      default: true,
    },

    inactive: {
      type: Boolean,
      default: false,
    },

    maxLength: {
      type: Number,
      default: 0,
    },

    currentLength: {
      type: Number,
      default: 0,
    },

    // If readonly, the label is shown full size even when the input has focus,
    // when empty
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    inputClass() {
      return this.classes({
        focus: this.hasFocus,
        inactive: this.inactive,
        error: !!this.error,
      });
    },

    labelClass() {
      return this.classes('label', {
        aside: (this.hasFocus && !this.readonly) || !this.isEmpty,
      });
    },

    showCounter() {
      return this.currentLength / this.maxLength >= 0.8;
    },

    showCounterStop() {
      return this.currentLength > this.maxLength;
    },

    hasRightSlot() {
      return this.$scopedSlots.right !== undefined;
    },

    counterClass() {
      return this.classes('counter', {
        show: this.showCounter,
        stop: this.showCounterStop,
      });
    },

    warningClass() {
      return this.classes('error-icon', {
        moveright: this.hasRightSlot,
        movedown: this.maxLength > 0 && this.showCounter,
      });
    },
  },
});
</script>
