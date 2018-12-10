<template>
  <s-base-input
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    v-bind="$attrs"
  >

    <input
      class="s-input__input"
      :type="type"
      :value="value"
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
      <span class="s-input__value">{{ value }}</span><span class="s-input__format__remaining">{{ remainingFormat }}</span>
    </span>

  </s-base-input>
</template>

<script lang="ts">
import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 's-text-field',

  components: {
    SBaseInput,
  },

  props: {
    value: {
      type: String,
      default: '',
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
  },

  data() {
    return {
      hasFocus: false,
    };
  },

  computed: {
    isEmpty(): boolean {
      return !this.value;
    },

    type(): string {
      switch (true) {
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

    remainingFormat(): string {
      if (!this.format) return '';
      return this.format.substring(this.value.length);
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
      if (this.phone) {
        return (
          keyCode === 43 ||
          keyCode === 45 ||
          keyCode >= 48 && keyCode <= 57
        );
      } else {
        return true;
      }
    },
  },
});
</script>
