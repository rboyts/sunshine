<template>
  <router-link
    :class="$class('link')"
    :to="to"
  >
    <span
      tabIndex="-1"
      :class="$class('wrapper')"
    >
      <span
        ref="title"
        :class="$class('title')"
      >
        <slot />
      </span>
    </span>
  </router-link>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'STab',

  props: {
    to: {
      type: String,
      required: true,
    },
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
