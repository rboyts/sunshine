<template>
  <s-base-input
    :style="baseStyle"
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    :label="$attrs.label"
    :readonly="$attrs.readonly"
  >

    <textarea
      class="s-input__input s-input__textarea"
      :disabled="inactive"
      v-bind="$attrs"
      v-on="listeners"
      v-model="internalValue"
      @focus="hasFocus = true"
      @blur="hasFocus = false">
    </textarea>

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
    width: {
      type: String,
      default: '10em',
    },
    height: {
      type: String,
      default: '10em',
    },
    maxHeight: {
      type: String,
      default: '10em',
    },
    inactive: {
      type: Boolean,
      default: false,
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
      return !this.internalValue;
    },
    listeners() {
      const
        {
          input, ...listeners
        } = this.$listeners;
      return listeners;
    },
    baseStyle() {
      return {
        height: this.height,
        width: this.width,
        alignItems: 'baseline',
      };
    },
  },
});

</script>
