<template>
  <span
    class="ui-input"
    :class="{
      'ui-input--focus': hasFocus,
      'ui-input--inactive': inactive,
    }"
  >
    <span
      class="ui-input--label"
      :class="{'ui-input--label-aside': hasFocus || !isEmpty}"
    >
      {{ label }}
    </span>

    <slot />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

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

});
</script>
