<template>
  <div
    v-if="visible"
    :class="classes('wrapper')"
    @click.self="close"
  >
    <div :class="classes({ visible })">
      <div :class="classes('header')">
        <span :class="classes('heading')">{{ heading }}</span>
        <s-icon @click="close" package="sunshine24" name="close" />
      </div>
      <slot v-bind="{ close }" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { ClassesMixin } from '../lib/utils';

export default Vue.extend({
  name: 's-dialog',

  mixins: [
    ClassesMixin,
  ],

  model: {
    prop: 'visible',
    event: 'toggle',
  },

  props: {
    visible: {
      type: Boolean,
      default: true,
    },

    heading: String,
  },

  methods: {
    close() {
      this.$emit('toggle', false);
    },
  },

  watch: {
    // HACK
    async visible(next, prev) {
      if (next && !prev) {
        await Vue.nextTick();
        this.$el.querySelector('input').focus();
      }
    },
  },
});
</script>
