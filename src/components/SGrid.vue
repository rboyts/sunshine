<template>
  <div :class="$class()">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SGrid',

  inject: ['$validator'],
});
</script>
