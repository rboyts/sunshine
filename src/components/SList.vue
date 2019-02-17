<template>
  <ul :class="classes()">
    <slot />
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-list',

  methods: {
    ensureSelectedVisible() {
      const el = this.$el as HTMLElement;
      const selected = this.$el.querySelector('.s-list-item--selected') as HTMLElement;
      if (!selected) return;

      if (selected.offsetTop < this.$el.scrollTop) {
        selected.scrollIntoView(true);
      } else if (selected.offsetTop + selected.offsetHeight > el.scrollTop + el.offsetHeight) {
        selected.scrollIntoView(false);
      }
    },
  },

  updated() {
    this.ensureSelectedVisible();
  },

  mounted() {
    Vue.nextTick(() => {
      this.ensureSelectedVisible();
    });
  },
});
</script>
