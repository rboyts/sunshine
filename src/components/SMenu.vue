<template>
  <div :class="classes()">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import Watcher from './mixins/watcher';
import { ClassesMixin } from '../lib/utils';

// Close active menu when clicking anywhere outside
let activeMenu: any = null;
window.addEventListener('click', (event: MouseEvent) => {
  if (!activeMenu) return;

  // Ignore clicks on the menu/activator itself
  let el = activeMenu.$el as HTMLElement;
  if (el.contains(event.target as HTMLElement)) return;

  activeMenu.hide();
  activeMenu = null;
}, true);

const setActive = (value: any) => {
  if (activeMenu && activeMenu !== value) {
    activeMenu.hide();
  }
  activeMenu = value;
};

export default mixins(ClassesMixin, Watcher).extend({
  name: 's-menu',

  props: {
    value: Boolean,

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
    };
  },

  watch: {
    async value(val) {
      this.transitioning = true;

      if (val) {
        setActive(this);
        let activator = this.$el as HTMLElement;
        let rect = activator.getBoundingClientRect();
        this.style = {
          top: `${rect.bottom}px`,
          left: `${rect.left}px`,
          minWidth: `${rect.width}px`,
          height: 0,
        };
        this.contentStyle = {
          opacity: 0,
        };

        await Vue.nextTick();
        this.startWatcher();

        const content = this.$refs.content as HTMLElement;
        this.style.height = `${content.offsetHeight}px`;
        this.contentStyle.opacity = 1;
      } else {
        if (activeMenu === this) {
          setActive(null);
        }
        this.style.height = 0;
        this.contentStyle.opacity = 0;
      }
    },
  },

  computed: {
    showContent(): boolean {
      return this.value || this.transitioning;
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
      if (this.toggleOnClick) {
        this.toggle(!this.value);
      }
    },

    onContentClick(event: MouseEvent) {
      // ignore
    },

    onWatcher() {
      let activator = this.$el as HTMLElement;
      let rect = activator.getBoundingClientRect();
      Object.assign(this.style, {
        top: `${rect.bottom}px`,
        left: `${rect.left}px`,
        minWidth: `${rect.width}px`,
      });
    },

    onTransitionEnd() {
      this.transitioning = false;
      if (!this.value) {
        this.stopWatcher();
      }
    },
  },
});
</script>
