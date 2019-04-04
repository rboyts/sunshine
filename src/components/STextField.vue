<template>
  <s-base-input
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    :error="error"
    :label="label"
    :maxLength="maxLength"
    :currentLength="currentLength"
    class="s-text-field"
  >

    <input
      :class="{ 's-input__input': true, 's-input__input--with-label': !!label }"
      :type="type"
      :disabled="inactive"
      v-model="internalValue"
      :placeholder="placeholder"
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

<script>
import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 's-text-field',

  inheritAttrs: false,

  $_veeValidate: {
    value() {
      return this.internalValue;
    },
  },

  components: {
    SBaseInput,
  },

  props: {
    label: String,
    error: String,

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
    placeholder: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      internalValue: this.value,
      hasFocus: false,
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
    isEmpty() {
      return !this.internalValue && !this.placeholder;
    },

    type() {
      switch (true) {
        case this.number:
          return 'number';
        case this.phone:
          return 'tel';
        case this.password:
          return 'password';
        case this.email:
          return 'email';
        default:
          return 'text';
      }
    },

    remainingFormat() {
      if (!this.format) return '';
      return this.format.substring(`${this.internalValue}`.length);
    },

    currentLength() {
      let val = this.internalValue;
      return val instanceof String ? val.length : val.toString().length;
    },
  },

  methods: {
    onKeyPress(event) {
      if (!this.isValidKey(event.keyCode)) {
        event.preventDefault();
      }
    },

    isValidKey(keyCode) {
      if (this.phone) {
        return (
          keyCode === 43 ||
          keyCode === 45 ||
          (keyCode >= 48 && keyCode <= 57)
        );
      } else {
        return true;
      }
    },
  },
});
</script>
