<template>
  <span class="s-checkbox__box">
    <transition name="fade">
      <span v-show="checked" class="fas fa-check" />
    </transition>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
// import { classHelper } from '../lib/utils';

// const checkboxClassHelper = classHelper('s-checkbox');

export default Vue.extend({
  name: 's-checkable-internal',

  props: {
    checked: Boolean,

    inactive: {
      type: Boolean,
      default: false,
    },

    hasFocus: {
      type: Boolean,
      default: false,
    },
  },

  // computed: {
  //   classes(): object {
  //     return checkboxClassHelper({
  //       focus: this.hasFocus,
  //       inactive: this.inactive,
  //     });
  //   },
  // },
});
</script>

