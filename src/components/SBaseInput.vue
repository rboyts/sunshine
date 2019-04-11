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
    <svg
      v-if="error"
      class="s-input__error-svg"
      width="10"
      height="9"
    >
      <path
        fill="#E94E1B"
        fill-rule="nonzero"
        d="M5.894 1.327l3.113 6.226A1 1 0 0 1 8.113 9H1.887
           a1 1 0 0 1-.894-1.447l3.112-6.226a1 1 0 0 1 1.79 0z"
      />
    </svg>
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

    counterClass() {
      return this.classes('counter', {
        show: this.showCounter,
        stop: this.showCounterStop,
      });
    },
  },
});
</script>
