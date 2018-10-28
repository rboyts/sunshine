<template>
  <div>
    <a
      href="#"
      class="ui-accordion-heading"
      @_click="$emit('click')"
      @click="onClick"
    >
      <slot name="heading" />
      <span class="right" :class="{open: open}">&or;</span>
    </a>

    <transition name="dropdown">
      <div v-show="open" class="ui-accordion-body">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-accordion-item',

  // XXX parent should handle state
  data() {
    return {
      open: false,
    };
  },

  methods: {
    onClick() {
      this.open = !this.open;
    },
  },

});
</script>
