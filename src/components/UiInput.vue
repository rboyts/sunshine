<template>
  <span
    class="ui-input"
    :class="{
      'ui-input--focus': hasFocus,
      'ui-input--inactive': inactive,
    }"
  >
    <span
      class="ui-input--label"
      :class="{'ui-input--label-aside': hasFocus || hasText}"
    >
      {{ label }}
    </span>

    <input
      class="ui-input--input"
      :type="type"
      :value="value"
      :disabled="inactive"
      @input="onInput"
      @keypress="onKeyPress"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-input',

  props: {
    label: String,
    value: {
      type: String,
      default: '',
    },
    phone: {
      type: Boolean,
      default: false,
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
    hasText(): boolean {
      return !!this.value;
    },

    type(): string {
      if (this.phone) {
        return 'tel';
      } else {
        return 'text';
      }
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
