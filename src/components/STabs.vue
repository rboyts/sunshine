<template>
  <div>
    <div>ScrollPos: {{ curScroll }} </div>
    <div
      :class="classes()"
    >
      <div :class="classes('main')">
        <div
          v-if="showLeftBtn"
          tabindex="0"
          :class="classes('button')"
          class="flex"
          @click="onLeftClick"
          @mouseover="hoverLeft = true"
          @mouseleave="hoverLeft = false"
        >
          <div
            :class="classes('arrow-icon-left', { 'hover': hoverLeft })"
            class="sunshine24-arrow"
          />
        </div>
        <div
          ref="tabs"
          :style="{ flex: 1 }"
          style="overflow: hidden; position: relative"
        >
          <div
            ref="menu"
            :class="classes('menu', { overflowleft })"
            :style="menuStyle"
          >
            <slot />
            <div :class="classes('border')">
              <div
                v-if="highlight.width !== -1"
                :class="classes('highlight')"
                :style="highlightStyle"
              />
            </div>
          </div>
        </div>
        <div
          ref="button"
          v-if="showRightBtn"
          tabindex="0"
          :class="classes('button')"
          class="flex"
          @click="onRightClick"
          @mouseover="hoverRight = true"
          @mouseleave="hoverRight = false"
        >
          <div
            :class="classes('arrow-icon-right ', { 'hover': hoverRight })"
            class="sunshine24-arrow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import ClassesMixin from './internal/ClassesMixin';

export default mixins(ClassesMixin).extend({
  name: 's-tabs',

  data() {
    return {
      highlight: {
        left: 0,
        width: -1,
      },
      curScroll: 0,
      maxScroll: 0,
      hoverLeft: false,
      hoverRight: false,
    };
  },

  computed: {
    menuStyle(this: any) {
      return {
        position: 'absolute',
        left: `${-this.curScroll}px`,
        // paddingRight: `${this.curScroll}px`,
        // marginRight: `${-this.maxScroll}px`,
      };
    },

    highlightStyle(this: any) {
      return {
        width: `${this.highlight.width}px`,
        left: `${this.highlight.left}px`,
      };
    },

    overflowleft(this: any) {
      return this.maxScroll > 0;
    },

    showLeftBtn(this: any) {
      return this.curScroll > 0;
    },

    showRightBtn(this : any) {
      return this.maxScroll > 0 && this.maxScroll !== this.curScroll;
    },
  },

  methods: {
    setActiveTab(this: any, tab: Vue) {
      this.activeTab = tab;
      this.ensureVisible(tab.$el);
      this.updateHighlight();
    },

    setHighlight(left: number, width: number) {
      this.highlight = {
        left,
        width,
      };
    },

    updateHighlight(this: any) {
      if (!this.activeTab) return;

      let el = this.activeTab.$el;
      if (el == null) return;

      if (this.highlight.width === '-1') {
        this.setHighlight(el.offsetLeft + el.offsetWidth / 2, 0);
      } else {
        this.setHighlight(el.offsetLeft, el.offsetWidth);
      }
    },

    ensureVisible(this: any, elem: any) {
      const { offsetLeft, offsetWidth } = elem;
      if (offsetLeft < 0) {
        this.curScroll = Math.max(0, this.curScroll + offsetLeft);
      } else if (offsetLeft + offsetWidth > this.$refs.tabs.clientWidth) {
        this.curScroll = Math.min(this.maxScroll,
          this.curScroll + offsetLeft + offsetWidth - this.$refs.tabs.clientWidth);
      }
    },

    async setScrollValues(this: any) {
      const oldMaxScroll = this.maxScroll;
      const oldCurScroll = this.curScroll;
      this.maxScroll = 0;
      this.curScroll = 0;
      await Vue.nextTick();
      this.maxScroll = Math.max(0, this.$refs.menu.clientWidth - this.$refs.tabs.clientWidth);
      await Vue.nextTick();
      if (this.maxScroll && oldMaxScroll) {
        this.curScroll = oldCurScroll * (this.maxScroll / oldMaxScroll);
      }
    },

    onLeftClick() {
      this.curScroll = Math.max(0, this.curScroll - this.$refs.menu.clientWidth / 3);
    },

    onRightClick() {
      this.curScroll = Math.min(this.maxScroll, this.curScroll + this.$refs.menu.clientWidth / 3);
    },
  },

  created(this: any) {
    this.activeTab = null;
    this.timerId = null;
  },

  mounted(this: any) {
    this.timerId = setInterval(() => {
      this.updateHighlight();
    }, 250);

    // use a watch on clientWidth instead?
    window.addEventListener('resize', () => { this.setScrollValues(); });
    this.setScrollValues();
  },

  beforeDestroy(this: any) {
    clearInterval(this.timerId);
  },
});
</script>
