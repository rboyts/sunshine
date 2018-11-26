<template>
  <div class="ui-inspector">
    <div class="ui-inspector__heading">
      <slot name="heading" />
    </div>

    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-inspector',
});
</script>
