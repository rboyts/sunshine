<template>
  <s-base-input
    class="s-text-area"
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    :label="label"
    :error="error"
    :readonly="readonly"
    :maxLength="maxLength"
    :currentLength="currentLength"
  >
    <textarea
      ref="inputArea"
      :class="{ 's-input__input s-input__textarea' : true,
                's-input__textarea--with-label' : !!label }"
      :style="inputAreaStyle"
      :rows="rows"
      :disabled="inactive"
      :readonly="readonly"
      :placeholder="placeholder"
      v-bind="$attrs"
      v-on="listeners"
      v-model="internalValue"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    >
    </textarea>
  </s-base-input>
</template>

<script>
import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 's-text-area',
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

    error: String,

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

    listeners() {
      const { input, ...listeners } = this.$listeners;
      return listeners;
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
