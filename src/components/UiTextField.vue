<template>
  <ui-base-input
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    v-bind="$attrs"
  >

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
  </ui-base-input>
</template>

<script lang="ts">
import Vue from 'vue';
import UiBaseInput from './UiBaseInput.vue';

export default Vue.extend({
  name: 'ui-text-field',

  components: {
    UiBaseInput,
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
