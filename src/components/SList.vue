<template>
  <ul :class="classes()">
    <slot />
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-list',
});
</script>
