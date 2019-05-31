<!--
TODO:
- Need to validate character types as well (e.g. numeric/text)
- Requires two "format" props, one for display (e.g. 'dd.mm.yyyy',
  and one for parsing (e.g. '00.00.0000')
- Behaves badly when moving cursor and "editing" text
-->

<template>
  <div :class="$class()">
    <input
      v-if="format"
      ref="format"
      :value="combinedValue"
      :class="[inputClass, $class('format')]"
      disabled
      v-bind="$attrs"
    >
    <input
      ref="input"
      :value="internalValue"
      :class="[inputClass, $class('input')]"

      v-bind="$attrs"
      v-on="listeners"
    >
  </div>
</template>

<script>
import Vue from 'vue';

const PunctuationChars = '!@#$%&:;,.+-()/';

const isPunctuation = ch => PunctuationChars.includes(ch);

export default Vue.extend({
  name: 'SFormatInput',
  inheritAttrs: false,

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

    punctuationIndicies() {
      if (!this.format) return undefined;
      const indicies = [];
      for (let i = 0; i < this.format.length; i++) {
        const ch = this.format[i];
        if (isPunctuation(ch)) {
          indicies.push([i, ch]);
        }
      }
      return indicies;
    },
  },

  watch: {
    value(val) {
      this.internalValue = val;
    },

    internalValue: {
      handler(val) {
        if (val !== this.value) {
          this.$emit('input', val);
        }
      },
      immediate: true,
    },
  },

  methods: {
    onInput(event) {
      let val = event.target.value;

      if (this.format) {
        const chars = Array.from(val);

        let pos = 0;
        for (const [i, ch] of this.punctuationIndicies) {
          // zero-pad section
          let p = chars.slice(pos).findIndex(c => isPunctuation(c));
          if (p !== -1) {
            let pad = i - (p + pos);
            while (pad-- > 0) {
              chars.splice(pos, 0, '0');
            }
          }

          if (chars.length <= i) break;

          // insert/replace punctuation
          chars.splice(i, isPunctuation(chars[i]) ? 1 : 0, ch);
          pos = i + 1;
        }

        val = chars.slice(0, this.format.length).join('');
      }

      this.internalValue = val;
    },

    onScroll() {
      if (this.$refs.format) {
        this.$refs.format.scrollLeft = this.$refs.input.scrollLeft;
      }
    },
  },
});
</script>
