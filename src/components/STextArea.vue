<template>
  <s-base-input
    class="s-text-area"
    :style="baseHeight"
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    :label="label"
    :readonly="readonly"
  >

  <div :class="{ 's-input__textarea__wrapper--with-label': !!label,
                 's-input__textarea__wrapper': !label }"
    @click="$refs.inputArea.focus()"
  >
    <textarea
      ref="inputArea"
      class="s-input__input s-input__textarea"
      :disabled="inactive"
      :readonly="readonly"
      :placeholder="placeholder"
      v-bind="$attrs"
      v-on="listeners"
      v-model="internalValue"
      @focus="hasFocus = true"
      @blur="hasFocus = false">
    </textarea>
  </div>

  </s-base-input>
</template>
<script>

import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 's-text-area',
  inheritAttrs: false,

  components: {
    SBaseInput,
  },

  props: {
    value: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '5em',
    },
    maxHeight: {
      type: String,
      default: '5em',
    },
    inactive: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
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
    listeners() {
      const { input, ...listeners } = this.$listeners;
      return listeners;
    },
    baseHeight() {
      return {
        height: this.height,
      };
    },
  },
});

</script>
