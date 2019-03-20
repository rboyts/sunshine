<template>
  <s-base-input
    id="base"
    ref="baseInput"
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
      :class="{ 's-input__input': true, 's-input__textarea': !scrollBar,
                's-input__textarea--show-scrollbar': scrollBar }"
      :disabled="inactive"
      :readonly="readonly"
      :placeholder="placeholder"
      v-bind="$attrs"
      v-on="listeners"
      v-model="internalValue"
      @input="setHeight"
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
    initHeight: {
      type: Number,
      default: 80,
    },
    maxHeight: {
      type: Number,
      default: 200,
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
      height: this.initHeight,
      hasFocus: false,
      scrollBar: false,
    };
  },

  methods: {
    setHeight(event) {
      const scrollHeight = event.target.scrollHeight;
      if (scrollHeight > this.initHeight && scrollHeight < this.maxHeight) {
        this.height = scrollHeight;
      } else if (scrollHeight <= this.maxHeight) {
        this.scrollBar = false;
      } else {
        this.scrollBar = true;
      }
    },
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
        height: `${this.height}px`,
      };
    },
  },

});

</script>
