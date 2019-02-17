<template>
  <div :class="classes()">
    <a
      href="#"
      :class="classes('heading')"
      @_click="$emit('click')"
      @click="onClick"
    >
      <slot name="heading" />
      <s-svg :class="classes('chevron', chevronOptions)" name="arrow" />
    </a>

    <div
      v-show="showBody"
      :class="classes('body', bodyOptions)"
      :style="bodyStyle"
      @transitionend="onTransitionEnd"
    >
      <div ref="inner" :class="classes('content')">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';
import SSvg from './internal/SSvg.vue';

export default mixins(ClassesMixin).extend({
  name: 's-accordion-item',

  components: {
    SSvg,
  },

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

    chevronOptions(): object {
      return { rotate: !this.open };
    },

    bodyOptions(): object {
      return {
        open: this.open,
        transitioning: this.transitioning,
      };
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
