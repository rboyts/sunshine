<template>
  <span ref="activator" class="menu-wrap">
    <span @click="onClick">
      <slot name="activator"></slot>
    </span>

    <transition name="fade">
      <div v-if="value" class="menu-popup" :style="style">
        <slot name="content"></slot>
      </div>
    </transition>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

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

<style lang="scss" scoped>
.menu-wrap {
  position: relative;
  display: inline-block;
}

.menu-popup {
  position: absolute;
  min-height: 16px;
  min-width: 100px;
  z-index: 1000;

  background-color: #fff;
  border: 1px solid #999;
  border-radius: 3px;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.fade-enter-active {
  animation: drop-down .2s;
  transform-origin: 0 0;
}

.fade-leave-active {
  animation: drop-down .2s reverse;
  transform-origin: 0 0;
}

@keyframes drop-down {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}
</style>

