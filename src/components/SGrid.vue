<template>
  <div class="grid">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-grid',
});
</script>
