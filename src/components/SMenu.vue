<template>
  <div :class="$class()">
    <div @click="onClick">
      <slot name="activator" />
    </div>

    <div
      v-if="showContent"
      :class="$class('popup')"
      :style="style"
      @click.stop="onContentClick"
      @transitionend="onTransitionEnd"
    >
      <div
        ref="content"
        :class="$class('popup', 'content')"
        :style="contentStyle"
      >
        <!--
          XXX Using a scoped slot here may cause expensive redendering on every
          animation frame. Need to profile this.
        -->
        <slot
          name="content"
          v-bind="{ hide }"
        />
      </div>
    </div>

    <global-events
      v-if="isOpen"
      target="window"
      @pointerdown.capture="onWindowClick"
      @focus.capture="onWindowClick"
    />

    <watcher
      v-if="showContent"
      @trigger="onWatcher"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GlobalEvents from 'vue-global-events';
import Watcher from './internal/Watcher';

export default Vue.extend({
  name: 'SMenu',

  components: {
    GlobalEvents,
    Watcher,
  },

  props: {
    value: {
      type: Boolean,
      required: false,
    },

    /**
     * Align menu towards the left, instead of right.
     */
    left: {
      type: Boolean,
      default: false,
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
      const width = document.documentElement.clientWidth;

      const spaceDown = height - rect.bottom;
      const spaceUp = rect.top;

      const align = this.left ? { right: `${width - rect.right}px` } : { left: `${rect.left}px` };

      if (spaceDown > spaceUp || spaceDown > 300) {
        this.style = {
          ...this.style,
          ...align,
          top: `${rect.bottom}px`,
          bottom: undefined,
          minWidth: `${rect.width}px`,
        };
      } else {
        this.style = {
          ...this.style,
          ...align,
          top: undefined,
          bottom: `${height - rect.top}px`,
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
    onWindowClick(event: UIEvent) {
      // Ignore clicks on the menu/activator itself
      let el = this.$el as HTMLElement;
      if (event.target instanceof Node && el.contains(event.target as Node)) return;

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
