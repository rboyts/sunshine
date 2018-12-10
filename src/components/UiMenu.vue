<template>
  <span ref="activator" class="ui-menu">
    <span @click="onClick">
      <slot name="activator" />
    </span>

    <transition name="dropdown">
      <div v-if="value" class="ui-menu__popup" :style="style" @click.stop="onContentClick">
        <slot name="content"></slot>
      </div>
    </transition>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

// Close active menu when clicking anywhere outside
let activeMenu: any = null;
window.addEventListener('click', (event: MouseEvent) => {
  if (activeMenu) {
    activeMenu.hide();
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
    toggle(val: boolean) {
      this.$emit('input', val);
    },

    hide() {
      this.toggle(false);
    },

    onClick(event: MouseEvent) {
      // This relies on the watcher for the value prop being invoked after the
      // event has propagated to the window

      this.toggle(!this.value);

      if (activeMenu === this) {
        activeMenu = null;
        event.stopPropagation();
      }
    },

    onContentClick(event: MouseEvent) {
      // ignore
    },
  },
});
</script>
