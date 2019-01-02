<template>
  <div :class="classes()">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-accordion',
});
</script>

