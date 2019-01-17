<template>
  <div :class="classes(alertOptions)">
    <div :class="classes('status', alertOptions)" />

    <div :class="classes('content')">
      <s-icon v-if="icon" :name="icon" />

      <div :class="classes('main')">
        <slot />
      </div>

      <div :class="classes('buttons')">
        <slot name="buttons" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-alert',

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

    icon: String,
  },

  computed: {
    alertOptions(): object {
      return {
        success: this.success,
        warning: this.warning,
        error: this.error,
      };
    },
  },
});
</script>

