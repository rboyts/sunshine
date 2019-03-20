<template>
  <span :class="classes()">
    <span @click="onClick">
      <slot name="activator" />
    </span>

    <div
      v-if="showContent"
      :class="classes('popup')"
      :style="style"
      @click.stop="onContentClick"
      @transitionend="onTransitionEnd"
    >
      <div ref="content" :class="classes('popup', 'content')" :style="contentStyle">
        <slot name="content"></slot>
      </div>
    </div>

    <global-events
      v-if="isOpen"
      target="window"
      @pointerdown.capture="onWindowClick"
    />

    <watcher
      v-if="showContent"
      @trigger="onWatcher"
    />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import GlobalEvents from 'vue-global-events';
import Watcher from './internal/Watcher';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-menu',

  components: {
    GlobalEvents,
    Watcher,
  },

  props: {
    value: {
      type: Boolean,
      required: false,
    },

    // TODO default false?
    toggleOnClick: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      style: {} as {[key: string]: any},
      contentStyle: {} as {[key: string]: any},
      transitioning: false,
      isOpen: !!this.value,
    };
  },

  watch: {
    value(val) {
      this.isOpen = !!val;
    },

    isOpen(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }

      this.transitioning = true;

      if (val) {
        this.setPosition();
        this.animateOpen();
      } else {
        this.animateClose();
      }
    },
  },

  computed: {
    showContent(): boolean {
      return this.isOpen || this.transitioning;
    },
  },

  methods: {
    setPosition() {
      let activator = this.$el as HTMLElement;
      let rect = activator.getBoundingClientRect();

      const height = document.documentElement.clientHeight;

      const spaceDown = height - rect.bottom;
      const spaceUp = rect.top;

      if (spaceDown > spaceUp || spaceDown > 300) {
        this.style = {
          ...this.style,
          top: `${rect.bottom}px`,
          bottom: undefined,
          left: `${rect.left}px`,
          minWidth: `${rect.width}px`,
        };
      } else {
        this.style = {
          ...this.style,
          top: undefined,
          bottom: `${height - rect.top}px`,
          left: `${rect.left}px`,
          minWidth: `${rect.width}px`,
        };
      }
    },

    async animateOpen() {
      this.style = { ...this.style, height: 0 };
      this.contentStyle = { opacity: 0 };

      await Vue.nextTick();
      this.setHeightToContentHeight();
    },

    async animateClose() {
      this.setHeightToContentHeight();
      await Vue.nextTick();
      this.setHeightToContentHeight(); // force reflow
      this.style = { ...this.style, height: 0 };
      this.contentStyle = { opacity: 0 };
    },

    setHeightToContentHeight() {
      const content = this.$refs.content as HTMLElement;
      this.style = { ...this.style, height: `${content.offsetHeight}px` };
      this.contentStyle = { opacity: 1 };
    },

    hide() {
      this.isOpen = false;
    },

    onClick(event: MouseEvent) {
      if (this.toggleOnClick) {
        this.isOpen = !this.isOpen;
      }
    },

    onContentClick(event: MouseEvent) {
      // ignore
    },

    onWatcher() {
      this.setPosition();
    },

    onTransitionEnd() {
      this.transitioning = false;
      const { height, ...rest } = this.style;
      this.style = rest;

      // Emit event when menu is completely closed
      if (!this.isOpen) {
        this.$emit('closed');
      }
    },

    // Close menu when clicking anywhere outside
    onWindowClick(event: MouseEvent) {
      // Ignore clicks on the menu/activator itself
      let el = this.$el as HTMLElement;
      if (el.contains(event.target as HTMLElement)) return;

      this.hide();
    },
  },

  mounted() {
    if (this.isOpen) {
      this.setPosition();
    }
  },
});
</script>
