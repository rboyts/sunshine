<template>
  <transition
    name="slide-in"
    @after-enter="$emit('after-enter')"
    @after-leave="$emit('after-leave')"
  >
    <div
      v-if="show"
      :class="$class()"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SInspector',
  inheritAttrs: false,

  model: {
    prop: 'show',
    event: 'toggle',
  },

  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
