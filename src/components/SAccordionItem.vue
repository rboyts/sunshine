<template>
  <div>
    <a
      href="#"
      class="s-accordion__heading"
      @_click="$emit('click')"
      @click="onClick"
    >
      <slot name="heading" />
      <i :class="chevronClass"
        class="fas fa-chevron-down" />
    </a>

    <div
      v-show="showBody"
      :class="bodyClass"
      :style="bodyStyle"
      @transitionend="onTransitionEnd"
    >
      <div ref="inner" :class="contentClass">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '../lib/utils';

const chevronClassHelper = classHelper('s-accordion', 'chevron');
const bodyClassHelper = classHelper('s-accordion', 'body');
const contentClassHelper = classHelper('s-accordion', 'content');

export default Vue.extend({
  name: 's-accordion-item',

  // XXX parent should handle state
  data() {
    return {
      open: false,
      height: 0,
      transitioning: false,
    };
  },

  watch: {
    async open(val) {
      this.transitioning = true;

      // Need to wait for height to be correct
      await Vue.nextTick();

      // We read offsetHeight from the element, even in the case when
      // we're setting height to 0, because accessing this property will
      // actually force the browser to do a 'reflow', making sure the height
      // is set to the initial value, before we change it. If we don't do this,
      // the transition may not always occur.
      // Ref: https://stackoverflow.com/a/16575811/137627
      const inner = this.$refs.inner as HTMLElement;
      const height = inner.offsetHeight;

      if (val) {
        this.height = height;
      } else {
        this.height = 0;
      }
    },
  },

  // TODO: We may need to handle resize events here,
  // to re-calculate height

  computed: {
    showBody(): boolean {
      return this.open || this.transitioning;
    },

    chevronClass(): object {
      return chevronClassHelper({open: this.open});
    },

    bodyClass(): object {
      return bodyClassHelper({
        open: this.open,
        transitioning: this.transitioning,
      });
    },

    contentClass(): object {
      return contentClassHelper({});
    },

    bodyStyle(): object {
      if (!this.transitioning) return {};

      return {
        height: `${this.height}px`,
        opacity: this.height === 0 ? 0 : 1,
      };
    },
  },

  methods: {
    onClick() {
      this.open = !this.open;
    },

    onTransitionEnd() {
      this.transitioning = false;
    },
  },
});
</script>
