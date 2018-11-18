<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '@/lib/utils';

const alertClassHelper = classHelper('ui-alert');


export default Vue.extend({
  name: 'ui-alert',

  props: {
    success: {
      type: Boolean,
      default: false,
    },
    warning: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes(): object {
      return alertClassHelper({
        success: this.success,
        warning: this.warning,
        error: this.error,
      });
    },
  },
})
</script>

