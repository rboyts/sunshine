<template>
  <s-base-input
    class="s-text-area"
    :inactive="inactive"
    :has-focus="hasFocus"
    :is-empty="isEmpty"
    :label="label"
    :error="error"
    :readonly="readonly"
    :max-length="maxLength"
    :current-length="currentLength"
  >
    <textarea
      ref="inputArea"
      :class="{
        's-input__input': true,
        's-input__textarea': true,
        's-input__textarea--with-label': !!label,
      }"
      :style="inputAreaStyle"
      :rows="rows"
      :disabled="inactive"
      :readonly="readonly"
      :placeholder="placeholder"
      v-bind="$attrs"
      v-model="internalValue"
      @focus="onFocus"
      @blur="onBlur"
    />
  </s-base-input>
</template>

<script>
import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 'STextArea',
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
    value: {
      type: String,
      default: '',
    },

    error: {
      type: String,
      default: undefined,
    },

    initRows: {
      type: Number,
      default: 2,
    },
    maxRows: {
      type: Number,
      default: 10,
    },
    maxLength: {
      type: Number,
      default: 0,
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
      curHeight: Number,
      lineHeight: Number,

      // Used initially, to calculate lineHeight
      rows: 10,
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
      this.updateHeight();
    },
  },

  computed: {
    isEmpty() {
      return !this.internalValue && !this.placeholder;
    },

    inputAreaStyle() {
      const height = this.curHeight ? `${this.curHeight}px` : 'auto';
      return { height };
    },

    minHeight() {
      return this.lineHeight * this.initRows;
    },

    maxHeight() {
      return this.lineHeight * this.maxRows;
    },

    currentLength() {
      return this.internalValue.length;
    },
  },

  methods: {
    onBlur() {
      this.hasFocus = false;
      this.$emit('blur');
    },

    onFocus() {
      this.hasFocus = true;
      this.$emit('focus');
    },

    async updateHeight() {
      // Temporarly Let the textarea scale down to it's minimum size,
      // to that we can check scrollHeight
      this.curHeight = null;

      await Vue.nextTick();

      const { scrollHeight } = this.$refs.inputArea;
      this.curHeight = Math.min(this.maxHeight, Math.max(this.minHeight, scrollHeight));
    },

    // The user sets the height/maxHeight in rows, but we use
    // pixels internally. The method calculates the line height
    // when the component is initially rendered, and then removes the 'rows'
    // attribute.
    calculateLineHeight() {
      const { clientHeight, scrollHeight } = this.$refs.inputArea;
      this.lineHeight = clientHeight / this.rows;

      // Don't need this anymore
      this.rows = undefined;
    },
  },

  mounted() {
    this.calculateLineHeight();
    this.updateHeight();
  },
});
</script>
