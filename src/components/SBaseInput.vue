<template>
  <div :class="inputClass">
    <span v-if="label" :class="labelClass">{{ label }}</span>
    <span v-if="maxchar > 0" :class="counterClass">{{ count }}/{{ maxchar }}</span>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '../lib/utils';

const inputClassHelper = classHelper('s-input');
const labelClassHelper = classHelper('s-input', 'label');
const counterClassHelper = classHelper('s-input', 'counter');

export default Vue.extend({
  name: 's-base-input',

  props: {
    label: String,
    hasFocus: {
      type: Boolean,
      default: false,
    },
    isEmpty: {
      type: Boolean,
      default: true,
    },
    inactive: {
      type: Boolean,
      default: false,
    },
    maxchar: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },

    // If readonly, the label is shown full size even when the input has focus,
    // when empty
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {

    inputClass(): object {
      return inputClassHelper({
        focus: this.hasFocus,
        inactive: this.inactive,
      });
    },

    labelClass(): object {
      return labelClassHelper({
        aside: (this.hasFocus && !this.readonly) || !this.isEmpty,
      });
    },
    counterClass(): object {
      const usedField = this.count / this.maxchar;
      let show = false;
      let stop = false;
      if (usedField >= 1) {
        stop = true;
      } else if (usedField >= 0.8) {
        show = true;
      }
      return counterClassHelper({
        show,
        stop,
      });
    },
  },
});
</script>
