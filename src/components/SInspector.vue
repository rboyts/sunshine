<template>
  <transition
    name="slide-in"
    @after-enter="$emit('after-enter')"
    @after-leave="$emit('after-leave')"
  >
    <div
      v-if="show"
      :class="classes()"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import ClassesMixin from './internal/ClassesMixin';

export default Vue.extend({
  name: 'SInspector',
  inheritAttrs: false,

  mixins: [
    ClassesMixin,
  ],

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
