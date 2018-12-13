<template>
  <li class="s-list__item">
    <slot />
  </li>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-list-item',
});
</script>
