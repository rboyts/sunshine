<template>
  <div :class="inputClass">
    <span :class="labelClass">{{ label }}</span>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '../lib/utils';

const inputClassHelper = classHelper('s-input');
const labelClassHelper = classHelper('s-input', 'label');

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
        aside: this.hasFocus && !this.readonly || !this.isEmpty,
      });
    },
  },

});
</script>
