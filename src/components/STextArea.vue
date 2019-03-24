<template>
  <s-base-input
    class="s-text-area"
    :inactive="inactive"
    :hasFocus="hasFocus"
    :isEmpty="isEmpty"
    :label="label"
    :readonly="readonly"
  >
    <div
      :class="{ 's-input__textarea__wrapper': true,
                's-input__textarea__wrapper--with-label': !!label }"
      @click="$refs.inputArea.focus()"
    >
      <textarea
        ref="inputArea"
        class="s-input__input s-input__textarea"
        :style="inputAreaStyle"
        :rows="initrows"
        :disabled="inactive"
        :readonly="readonly"
        :placeholder="placeholder"
        v-bind="$attrs"
        v-on="listeners"
        v-model="internalValue"
        @input="updateHeight"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      >
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
    initrows: {
      type: Number,
      default: 4,
    },
    maxrows: {
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
      minHeight: Number,
      maxHeight: Number,
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
    inputAreaStyle() {
      let unit = '';
      if (this.curHeight !== 'auto') {
        unit = 'px';
      }
      return {
        height: `${this.curHeight}${unit}`,
      };
    },
  },

  methods: {
    async updateHeight(event) {
      this.curHeight = 'auto';
      await Vue.nextTick();
      const contentHeight = event.target.scrollHeight;
      if (contentHeight <= this.minHeight) {
        this.curHeight = this.minHeight;
      } else if (contentHeight >= this.maxHeight) {
        this.curHeight = this.maxHeight;
      } else {
        this.curHeight = contentHeight;
      }
    },
    // The user sets the height/maxHeight in rows, but we use
    // pixels internally. The method calculates these values
    // and assigns the internal variables.
    setInternalValues() {
      const { clientHeight, scrollHeight } = this.$refs.inputArea;
      const lineHeight = clientHeight / this.initrows;
      this.contentHeight = scrollHeight;
      this.minHeight = clientHeight;
      this.maxHeight = lineHeight * this.maxrows;
      if (this.maxHeight < clientHeight) {
        this.maxHeight = clientHeight;
      }

      if (scrollHeight > clientHeight) {
        this.curHeight = scrollHeight < this.maxHeight ? scrollHeight : this.maxHeight;
      } else {
        this.curHeight = clientHeight;
      }
    },
  },

  mounted() {
    this.setInternalValues();
  },
});
</script>
