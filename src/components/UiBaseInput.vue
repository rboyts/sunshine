<template>
  <span :class="inputClass">
    <span :class="labelClass">
      {{ label }}
    </span>
    <slot />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '@/lib/utils';

const inputClassHelper = classHelper('ui-input');
const labelClassHelper = classHelper('ui-input', 'label');

export default Vue.extend({
  name: 'ui-base-input',

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
        aside: this.hasFocus || !this.isEmpty,
      });
    },
  },

});
</script>
