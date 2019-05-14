<template>
  <div>
    <div
      :class="classes()"
    >
      <div :class="classes('main')">
        <div
          ref="button"
          v-show="showLeftBtn"
          :class="classes('button')"
          @click="onLeftScrollClick"
        >
          <s-icon
            name="arrow"
            package="sunshine24"
            :rotate="-90"
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
          v-show="showRightBtn"
          :class="classes('button')"
          @click="onRightScrollClick"
        >
          <s-icon
            name="arrow"
            package="sunshine24"
            :rotate="90"
          />
        </div>
      </div>
    </div>

    <global-events
      target="window"
      @resize="onResize"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GlobalEvents from 'vue-global-events';
import mixins from 'vue-typed-mixins';
import ClassesMixin from './internal/ClassesMixin';

const SCROLL_EDGE_THRESHOLD = 100;

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

  computed: {
    // Internally curScroll and maxScroll are positive values. But in style/css
    // the tabs div starts off at position left 0 and the tabs div overflows the wrapper div
    // at the right side. To scroll we move the tabs div in the left direction (negative).
    tabsStyle(this: any) {
      return {
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

      let el = this.activeTab.getTitleElement();
      if (el == null) return;

      if (this.highlight.width === -1) {
        this.setHighlight(el.offsetLeft + el.offsetWidth / 2, 0);
        Vue.nextTick(this.updateHighlight);
      } else {
        this.setHighlight(el.offsetLeft, el.offsetWidth);
      }
    },

    ensureVisible(this: any, elem: any) {
      const elemRect = elem.getBoundingClientRect();
      const wrapperRect = this.$refs.wrapper.getBoundingClientRect();
      if (elemRect.left < wrapperRect.left) {
        this.curScroll = this.normalizeScroll(this.curScroll - wrapperRect.left + elemRect.left);
      } else if (elemRect.right > wrapperRect.right) {
        let buttonWidth = 0;
        if (!this.showLeftBtn) {
          buttonWidth = this.$refs.button.offsetWidth;
        }
        this.curScroll = this.normalizeScroll(this.curScroll + elemRect.right -
          wrapperRect.right + buttonWidth);
      }
    },

    async setScrollValues(this: any) {
      const oldMaxScroll = this.maxScroll;
      await Vue.nextTick();
      this.maxScroll = this.getMaxScroll();

      // In the first calculation of maxscroll no buttons are visible, but added
      // afterwards if maxScroll > 0. We need to recalculate to get the correct maxScroll
      // with buttons.
      await Vue.nextTick();
      this.maxScroll = this.getMaxScroll();

      this.curScroll = this.maxScroll && oldMaxScroll ?
        this.normalizeScroll(this.curScroll * (this.maxScroll / oldMaxScroll)) :
        0;
    },

    async onResize() {
      await this.setScrollValues();
      this.updateHighlight();
    },

    // When the content of the tabs is larger than the wrapper, we set a max scroll value;
    // if its less or equal the tabs fits within the wrapper and max scroll is 0.
    getMaxScroll() {
      return Math.max(0, this.$refs.tabs.clientWidth - this.$refs.wrapper.clientWidth);
    },

    normalizeScroll(scroll: number, { snapRight = false, snapLeft = false } = {}) {
      if (scroll <= 0) return 0;
      if (scroll >= this.maxScroll) return this.maxScroll;

      // "snapping"
      if (snapLeft && scroll <= SCROLL_EDGE_THRESHOLD) return 0;
      if (snapRight && scroll >= this.maxScroll - SCROLL_EDGE_THRESHOLD) return this.maxScroll;

      return Math.round(scroll);
    },

    onLeftScrollClick(this: any) {
      this.curScroll = this.normalizeScroll(this.curScroll -
        this.$refs.tabs.clientWidth / 3, { snapLeft: true });
    },

    onRightScrollClick(this: any) {
      this.curScroll = this.normalizeScroll(this.curScroll +
        this.$refs.tabs.clientWidth / 3, { snapRight: true });
    },

    onFocus(event: FocusEvent) {
      // Prevent native scrolling when pressing tab
      this.$refs.wrapper.scrollLeft = 0;
      this.ensureVisible(event.target);
    },
  },

  created(this: any) {
    this.activeTab = null;
  },

  async mounted() {
    // Wait until fonts are loaded
    if (window && window.document.fonts) {
      await window.document.fonts.ready;
    }

    this.onResize();
  },
});
</script>
