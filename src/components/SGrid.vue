<template>
  <div :class="classes()">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';
import ClassesMixin from './internal/ClassesMixin';

export default Vue.extend({
  name: 'SGrid',

  inject: ['$validator'],

  mixins: [
    ClassesMixin,
  ],
});
</script>
