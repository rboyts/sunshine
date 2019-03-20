<template>
  <s-base-input
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    :label="label"
  >

    <input
      :maxlength="maxLength"
      :class="{ 's-input__input': true, 's-input__input--with-label': !!label }"
      :type="type"
      :disabled="inactive"
      v-model="internalValue"
      @keypress="onKeyPress"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
      v-bind="$attrs"
    />

    <!-- expected format -->
    <span
      v-if="hasFocus && format"
      class="s-input__format"
    >
      <span class="s-input__value">{{
        internalValue
      }}</span><span class="s-input__format__remaining">{{
        remainingFormat
      }}</span>
    </span>

  </s-base-input>
</template>

<script lang="ts">
import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 's-text-field',

  inheritAttrs: false,

  components: {
    SBaseInput,
  },

  props: {
    maxlength: String,
    label: String,
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
      internalValue: this.value,
      hasFocus: false,
      formattedValue: this.value,
    };
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

  computed: {
    isEmpty(): boolean {
      return !this.internalValue;
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
      return this.format.substring(`${this.internalValue}`.length);
    },

    maxLength(): string | undefined {
      if (this.maxlength) {
        return this.maxlength;
      } else if (this.format) {
        return String(this.format.length);
      }
      return undefined;
    },
  },

  methods: {

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
