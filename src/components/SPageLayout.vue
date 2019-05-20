<template>
  <div
    :class="$class({ 'show-inspector': showInspector })"
    @click.self="$emit('background-click')"
  >
    <slot />

    <s-inspector
      :show="showInspector"
      @after-enter="onAfter"
      @after-leave="onAfter"
    >
      <slot name="inspector" />
    </s-inspector>
  </div>
</template>

<script>
import Vue from 'vue';
import SInspector from './SInspector.vue';

export default Vue.extend({
  name: 'SPageLayout',

  components: {
    SInspector,
  },

  props: {
    showInspector: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onAfter() {
      window.dispatchEvent(new Event('resize'));
    },
  },
});
</script>
