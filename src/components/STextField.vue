<template>
  <s-base-input
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    v-bind="$attrs"
  >

    <input
      class="s-input__input"
      :maxlength="maxLength"
      :type="type"
      :value="formatValue"
      :disabled="inactive"
      @input="onInput"
      @keypress="onKeyPress"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    />

    <!-- expected format -->
    <span
      v-if="hasFocus && format"
      class="s-input__format"
    >
      <span class="s-input__value">
        {{ value }}
      </span>
      <span class="s-input__format__remaining">
        {{ remainingFormat }}
      </span>
    </span>

  </s-base-input>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 's-text-field',

  components: {
    SBaseInput,
  },

  props: {
    maxlength: String,
    dateLocale: String,
    dateFormat: String,
    value: {
      type: [String, Number],
      default: '',
    },
    number: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Boolean,
      default: false,
    },
    password: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: null,
    },
    inactive: {
      type: Boolean,
      default: false,
    },
    moment: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      hasFocus: false,
      formattedValue: this.value,
    };
  },

  computed: {
    isEmpty(): boolean {
      return !this.value;
    },

    type(): string {
      switch (true) {
        case this.number:
          return 'number';
        case this.phone:
          return 'tel';
        case this.password:
          return 'password';
        case this.email:
          return 'email';
        case this.moment:
          return 'text';
        default:
          return 'text';
      }
    },

    remainingFormat(): string {
      if (!this.format) return '';
      return this.format.substring(`${this.value}`.length);
    },

    maxLength(): string | undefined {
      if (this.maxlength) {
        return this.maxlength;
      } else if (this.format) {
        return String(this.format.length);
      }
      return undefined;
    },
    formatSymbol(): string | undefined {
      return (this.format) ? this.format.match(/[^\w]/g)[0] : undefined;
    },
    formatSymbolIndicies(): number[] | undefined {
      if (!this.format) return undefined;
      const formatRegex = new RegExp(`[${this.formatSymbol}]`, 'g');
      const splitFormatString = this.format.split('');
      let formatSymbolIndicies = [];
      for (let a = 0, b = splitFormatString.length; a < b; a++) {
        if (splitFormatString[a].match(formatRegex) !== null) {
          formatSymbolIndicies.push(a);
        }
      }
      return formatSymbolIndicies;
    },
    formatValue(): string {
      if (!this.format) return `${this.value}`;
      let input = this.value as string;
      for (let a = 0, b = this.formatSymbolIndicies.length; a < b; a++) {
        if (input.length === this.formatSymbolIndicies[a]) {
          return `${this.value}${this.formatSymbol}`;
        }
      }
      return `${this.value}`;
    },
  },

  methods: {
    onInput(event: InputEvent) {
      let input = event.target as HTMLInputElement;
      this.$emit('input', input.value);
    },

    onKeyPress(event: KeyboardEvent) {
      if (!this.isValidKey(event.keyCode)) {
        event.preventDefault();
      }
    },

    isValidKey(keyCode: number): boolean {
      if (this.phone || this.moment) {
        return (
          keyCode === 43 ||
          keyCode === 45 ||
          (keyCode >= 48 && keyCode <= 57)
        );
      } else if (this.format) {
        return keyCode !== 32; // forbid space in formatted input
      } else {
        return true;
      }
    },
  },
});
</script>
