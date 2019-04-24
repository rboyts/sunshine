<template>
  <div>
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
          ref="wrapper"
          :class="classes('wrapper')"
        >
          <div
            ref="tabs"
            :class="classes('tabs')"
            :style="tabsStyle"
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

  watch: {
    curScroll(val, oldVal) {
      if (val !== oldVal) {
        this.curScroll = Math.round(val);
      }
    },
  },

  computed: {
    tabsStyle(this: any) {
      return {
        position: 'absolute',
        left: `${-this.curScroll}px`,
      };
    },

    highlightStyle(this: any) {
      return {
        width: `${this.highlight.width}px`,
        left: `${this.highlight.left}px`,
      };
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

      let el = this.activeTab.$refs.title;
      if (el == null) return;

      if (this.highlight.width === '-1') {
        this.setHighlight(el.offsetLeft + el.offsetWidth / 2, 0);
      } else {
        this.setHighlight(el.offsetLeft, el.offsetWidth);
      }
    },

    async ensureVisible(this: any, elem: any) {
      await Vue.nextTick();
      const elemOffset = elem.getBoundingClientRect();
      const wrapperOffset = this.$refs.wrapper.getBoundingClientRect();
      if (elemOffset.left < wrapperOffset.left) {
        this.curScroll = Math.max(0, this.curScroll - wrapperOffset.left + elemOffset.left);
      } else if (elemOffset.right > wrapperOffset.right) {
        if (!this.showLeftBtn) {
          this.curScroll += this.$refs.button.offsetWidth;
        }
        this.curScroll = Math.min(this.maxScroll,
          this.curScroll + elemOffset.right - wrapperOffset.right);
      }
    },

    async setScrollValues(this: any) {
      const oldMaxScroll = this.maxScroll;
      const oldCurScroll = this.curScroll;
      this.curScroll = 0;
      await Vue.nextTick();
      this.maxScroll = Math.max(0, this.$refs.tabs.clientWidth - this.$refs.wrapper.clientWidth);

      // In the first calculation of maxscroll no buttons are visible, but added
      // afterwards if maxScroll > 0. We need to recalculate to get the correct maxScroll
      // with buttons. Ok to just recalculate maxScroll in the next tick?
      await Vue.nextTick();
      this.maxScroll = Math.max(0, this.$refs.tabs.clientWidth - this.$refs.wrapper.clientWidth);
      if (this.maxScroll && oldMaxScroll) {
        this.curScroll = oldCurScroll * (this.maxScroll / oldMaxScroll);
      }
    },

    onLeftClick() {
      this.curScroll = Math.max(0, this.curScroll - this.$refs.tabs.clientWidth / 3);
    },

    onRightClick() {
      this.curScroll = Math.min(this.maxScroll, this.curScroll + this.$refs.tabs.clientWidth / 3);
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

    window.addEventListener('resize', this.setScrollValues);
    this.setScrollValues();
  },

  beforeDestroy(this: any) {
    window.removeEventListener('resize', this.setScrollValues);
    clearInterval(this.timerId);
  },
});
</script>
