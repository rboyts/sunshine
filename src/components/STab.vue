<template>
  <router-link
    :class="classes('link')"
    :to="to"
  >
    <span
      tabIndex="-1"
      :class="classes('wrapper')"
    >
      <span
        ref="title"
        :class="classes('title')"
      >
        <slot />
      </span>
    </span>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import ClassesMixin from './internal/ClassesMixin';

export default mixins(ClassesMixin).extend({
  name: 's-tab',

  props: {
    to: String,
  },

  watch: {
    $route: {
      async handler(route) {
        await Vue.nextTick();
        const classes = Array.from(this.$el.classList);
        if (classes.includes('router-link-active')) {
          (this.$parent as any).setActiveTab(this);
        }
      },
      immediate: true,
    },
  },

  methods: {
    getTitleElement() {
      return this.$refs.title;
    },
  },
});
</script>
