<template>
  <div :class="classes()">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-accordion',
});
</script>

