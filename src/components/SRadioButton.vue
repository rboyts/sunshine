<template>
  <label :class="classes">
    <span class="s-radio-button__box">
      <input
        type="radio"
        :name="name"
        :checked="checked"
        :disabled="inactive"
        @change="onChange"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      />
      <transition name="fade">
        <span v-if="checked">&bull;</span>
      </transition>
    </span>
    <slot/>
  </label>
</template>

<script>
import Vue from 'vue';
import { classHelper } from '../lib/utils';

const radioButtonClassHelper = classHelper('s-radio-button');

export default Vue.extend({
  name: 's-radio-button',

  props: {
    value: String,
    name: {
      type: String,
      default: '',
    },
    inactive: {
      type: Boolean,
      default: false,
    },
  },

  inject: [
    'group',
  ],

  data() {
    return {
      checked: false,
      hasFocus: false,
    };
  },

  computed: {
    classes() {
      return radioButtonClassHelper({
        focus: this.hasFocus,
        inactive: this.inactive,
      });
    },
  },

  methods: {
    onChange(event) {
      this.$emit('change', event.target.checked);
    },
  },

  mounted() {
    this.unregister = this.group.register(this);
  },

  beforeDestroy() {
    this.unregister();
  },
});
</script>

