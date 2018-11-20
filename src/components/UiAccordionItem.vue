<template>
  <div>
    <a
      href="#"
      class="ui-accordion__heading"
      @_click="$emit('click')"
      @click="onClick"
    >
      <slot name="heading" />
      <span :class="chevronClass" />
    </a>

    <div
      v-show="showBody"
      :class="bodyClass"
      :style="{height: `${height}px`}"
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
import { classHelper } from '@/lib/utils';

const chevronClassHelper = classHelper('ui-accordion', 'chevron');
const bodyClassHelper = classHelper('ui-accordion', 'body');
const contentClassHelper = classHelper('ui-accordion', 'content');

export default Vue.extend({
  name: 'ui-accordion-item',

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

      if (val) {
        const inner = this.$refs.inner as HTMLElement;
        this.height = inner.offsetHeight;
      } else {
        this.height = 0;
      }
    },
  },

  computed: {
    showBody(): boolean {
      return this.height !== 0 || this.transitioning;
    },

    chevronClass(): object {
      return chevronClassHelper({open: this.open});
    },

    bodyClass(): object {
      return bodyClassHelper({open: this.open});
    },

    contentClass(): object {
      return contentClassHelper({});
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
