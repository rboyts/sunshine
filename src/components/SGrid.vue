<template>
  <div :class="classes()">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';
import { ClassesMixin } from '../lib/utils';

export default Vue.extend({
  name: 'SGrid',

  inject: ['$validator'],

  mixins: [
    ClassesMixin,
  ],
});
</script>
