<template>
  <s-base-input
    :inactive="inactive"
    :has-focus="hasFocus"
    :is-empty="isEmpty"
    :readonly="readonly"
    :error="error"
    :label="label"
    :max-length="maxLength"
    :current-length="currentLength"
    class="s-text-field"
  >
    <s-format-input
      v-model="internalValue"
      :format="hasFocus ? format : ''"
      :maxlength="computedMaxLength"
      :type="type"
      :disabled="inactive"
      :readonly="readonly"
      :placeholder="placeholder"
      :input-class="{ 's-input__input': true, 's-input__input--with-label': !!label }"
      @keypress="onKeyPress"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
      v-bind="$attrs"
    />
  </s-base-input>
</template>

<script>
import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';
import SFormatInput from './internal/SFormatInput.vue';

export default Vue.extend({
  name: 'STextField',

  inheritAttrs: false,

  $_veeValidate: {
    value() {
      return this.internalValue;
    },
  },

  components: {
    SBaseInput,
    SFormatInput,
  },

  props: {
    label: {
      type: String,
      default: '',
    },

    error: {
      type: String,
      default: undefined,
    },

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

    readonly: {
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

    currentLength() {
      let val = this.internalValue;
      return val instanceof String ? val.length : val.toString().length;
    },

    computedMaxLength() {
      if (this.maxLength) {
        return this.maxLength;
      } else if (this.format) {
        return String(this.format.length);
      }
      return undefined;
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
      } else if (this.format) {
        return keyCode !== 32; // forbid space in formatted input
      } else {
        return true;
      }
    },
  },
});
</script>
