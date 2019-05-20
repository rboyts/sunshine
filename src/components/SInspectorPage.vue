<template>
  <form
    :class="$class()"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div :class="$class('header')">
      <slot name="header" />
    </div>

    <div :class="$class('main')">
      <slot />
    </div>

    <div :class="$class('footer')">
      <slot name="footer" />
    </div>
  </form>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SInspectorPage',
  inheritAttrs: false,

  inject: ['$validator'],
});
</script>
