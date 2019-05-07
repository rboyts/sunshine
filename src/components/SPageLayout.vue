<template>
  <div
    :class="classes({ 'show-inspector': showInspector })"
    @click.self="$emit('background-click')"
  >
    <slot />

    <s-inspector :show="showInspector">
      <slot name="inspector" />
    </s-inspector>
  </div>
</template>

<script>
import Vue from 'vue';
import ClassesMixin from './internal/ClassesMixin';
import SInspector from './SInspector.vue';

export default Vue.extend({
  name: 'SPageLayout',

  mixins: [
    ClassesMixin,
  ],

  components: {
    SInspector,
  },

  props: {
    showInspector: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
