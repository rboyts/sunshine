<template>
  <span ref="activator" class="ui-menu">
    <span @click="onClick">
      <slot name="activator"></slot>
    </span>

    <transition name="dropdown">
      <div v-if="value" class="ui-menu__popup" :style="style">
        <slot name="content"></slot>
      </div>
    </transition>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

// Close active menu when clicking anywhere outside
let activeMenu: Vue | null = null;
window.addEventListener('click', (event: MouseEvent) => {
  if (activeMenu) {
    activeMenu.$emit('input', false);
  }
  activeMenu = null;
});

export default Vue.extend({
  name: 'ui-menu',

  props: {
    value: Boolean,
  },

  data() {
    return {
      style: {},
    };
  },

  watch: {
    value(val) {
      if (val) {
        activeMenu = this;
        let activator = this.$refs.activator as HTMLElement;
        this.style = {
          top: `${activator.offsetHeight}px`,
          minWidth: `${activator.offsetWidth}px`,
          left: 0,
        };
      }
    },
  },

  methods: {
    onClick(event: MouseEvent) {
      this.$emit('input', !this.value);
    },
  },
});
</script>
