<template>
  <label>
    <input type="checkbox" :checked="checked" @change="$emit('change', $event.target.checked)" />
    <slot/>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'ui-checkbox',

  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: Boolean,
  },
});
</script>

