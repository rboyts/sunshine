<template>
  <div :class="classes()">
    <input
      v-if="format"
      ref="format"
      :value="combinedValue"
      :class="[inputClass, classes('format')]"
      disabled
      v-bind="$attrs"
    >
    <input
      ref="input"
      :value="internalValue"
      :class="[inputClass, classes('input')]"

      v-bind="$attrs"
      v-on="listeners"
    >
  </div>
</template>

<script>
import Vue from 'vue';
import ClassesMixin from './ClassesMixin';

export default Vue.extend({
  name: 'SFormatInput',
  inheritAttrs: false,

  mixins: [
    ClassesMixin,
  ],

  props: {
    format: {
      type: String,
      default: '',
    },

    value: {
      type: String,
      default: undefined,
    },

    inputClass: {
      type: null,
      default: undefined,
    },
  },

  data() {
    return {
      internalValue: this.value || '',
    };
  },

  computed: {
    remainingFormat() {
      if (!this.format) return '';
      return this.format.substring(`${this.internalValue}`.length);
    },

    combinedValue() {
      return this.internalValue + this.remainingFormat;
    },

    nativeListeners() {
      const { input, ...rest } = this.$listeners;
      return rest;
    },

    listeners() {
      const listeners = Object.assign({}, this.nativeListeners);
      listeners.input = this.onInput;

      // All input events than may cause scroll to change
      const events = [
        'keydown',
        'keyup',
        'focus',
        'blur',
        'click',
        'input',
        'change',
        'paste',
        'cut',
        'scroll',
        'wheel',
        'dragover',
      ];

      // Merge listeners
      for (let ev of events) {
        const listener = listeners[ev];
        if (listener) {
          listeners[ev] = event => { this.onScroll(); listener(event); };
        } else {
          listeners[ev] = this.onScroll;
        }
      }

      return listeners;
    },
  },

  watch: {
    value(val) {
      this.internalValue = val;
    },

    internalValue(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },
  },

  methods: {
    onInput(event) {
      this.internalValue = event.target.value;
    },

    onScroll() {
      if (this.$refs.format) {
        this.$refs.format.scrollLeft = this.$refs.input.scrollLeft;
      }
    },
  },
});
</script>
