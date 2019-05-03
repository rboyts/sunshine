<template>
  <div>
    <div
      :class="classes()"
    >
      <div :class="classes('main')">
        <div
          v-if="showLeftBtn"
          :class="classes('button')"
          class="flex"
          @click="onLeftScrollClick"
        >
          <div
            :class="classes('arrow-icon-left')"
            class="sunshine24-arrow"
          />
        </div>
        <div
          ref="wrapper"
          :class="classes('wrapper')"
          @focusin="onFocus"
        >
          <div
            ref="tabs"
            :class="classes('tabs')"
            :style="tabsStyle"
          >
            <slot />
            <div
              v-if="highlight.width !== -1"
              :class="classes('highlight')"
              :style="highlightStyle"
            />
          </div>
          <div :class="classes('border')" />
        </div>
        <div
          ref="button"
          v-if="showRightBtn"
          :class="classes('button')"
          class="flex"
          @click="onRightScrollClick"
        >
          <div
            :class="classes('arrow-icon-right')"
            class="sunshine24-arrow"
          />
        </div>
      </div>
    </div>
    <global-events
      target="window"
      @resize="resize"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GlobalEvents from 'vue-global-events';
import mixins from 'vue-typed-mixins';
import ClassesMixin from './internal/ClassesMixin';

export default mixins(ClassesMixin).extend({
  name: 's-tabs',

  components: {
    GlobalEvents,
  },

  data() {
    return {
      highlight: {
        left: 0,
        width: -1,
      },
      curScroll: 0,
      maxScroll: 0,
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
    // Internally curScroll and maxScroll are positive values. But in style/css
    // the tabs div starts off at position left 0 and the tabs div overflows the wrapper div
    // at the right side. To scroll we move the tabs div in the left direction (negative).
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
    async setActiveTab(this: any, tab: Vue) {
      this.activeTab = tab;
      await Vue.nextTick();
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

      let el = this.activeTab.getTitleElement();
      if (el == null) return;

      if (this.highlight.width === '-1') {
        this.setHighlight(el.offsetLeft + el.offsetWidth / 2, 0);
      } else {
        this.setHighlight(el.offsetLeft, el.offsetWidth);
      }
    },

    ensureVisible(this: any, elem: any) {
      const elemRect = elem.getBoundingClientRect();
      const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
      if (elemRect.left < wrapperRect.left) {
        this.curScroll = Math.max(0, this.curScroll - wrapperRect.left + elemRect.left);
      } else if (elemRect.right > wrapperRect.right) {
        let buttonWidth = 0;
        if (!this.showLeftBtn) {
          // We're actually interested in the width of the right buttom here,
          // but as it's not visible yet, we use the width of the right one
          // (should be of equal size).
          buttonWidth = this.$refs.button.offsetWidth;
        }
        this.curScroll = Math.min(this.maxScroll,
          this.curScroll + elemRect.right - wrapperRect.right + buttonWidth);
      }
    },

    async setScrollValues(this: any) {
      const oldMaxScroll = this.maxScroll;
      const oldCurScroll = this.curScroll;
      await Vue.nextTick();
      this.maxScroll = this.getMaxScroll();

      // In the first calculation of maxscroll no buttons are visible, but added
      // afterwards if maxScroll > 0. We need to recalculate to get the correct maxScroll
      // with buttons.
      await Vue.nextTick();
      this.maxScroll = this.getMaxScroll();
      this.curScroll = this.maxScroll && oldMaxScroll ?
        oldCurScroll * (this.maxScroll / oldMaxScroll) :
        0;
    },

    resize() {
      this.setScrollValues();
      this.updateHighlight();
    },

    // When the content of the tabs is larger than the wrapper, we set a max scroll value;
    // if its less or equal the tabs fits within the wrapper and max scroll is 0.
    getMaxScroll() {
      return Math.max(0, this.$refs.tabs.clientWidth - this.$refs.wrapper.clientWidth);
    },

    onLeftScrollClick() {
      let scroll = Math.max(0, this.curScroll - this.$refs.tabs.clientWidth / 3);
      this.curScroll = scroll <= 100 ? 0 : scroll;
    },

    onRightScrollClick() {
      let scroll = Math.min(this.maxScroll, this.curScroll + this.$refs.tabs.clientWidth / 3);
      this.curScroll = scroll >= this.maxScroll - 100 ? this.maxScroll : scroll;
    },

    onFocus(event: FocusEvent) {
      // Prevent native scrolling when pressing tab
      this.$refs.wrapper.scrollLeft = 0;
      this.ensureVisible(event.target);
    },
  },

  created(this: any) {
    this.activeTab = null;
    this.timerId = null;
  },

  mounted(this: any) {
    this.resize();
  },
});
</script>
