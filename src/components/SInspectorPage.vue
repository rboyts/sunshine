<template>
  <form
    :class="classes()"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div :class="classes('header')">
      <slot name="header" />
    </div>

    <div :class="classes('main')">
      <slot />
    </div>

    <div :class="classes('footer')">
      <slot name="footer" />
    </div>
  </form>
</template>

<script>
import Vue from 'vue';
import ClassesMixin from './internal/ClassesMixin';

export default Vue.extend({
  name: 'SInspectorPage',
  inheritAttrs: false,

  inject: ['$validator'],

  mixins: [
    ClassesMixin,
  ],
});
</script>
