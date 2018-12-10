<template>
  <div class="s-tabs">
    <slot />
    <div class="s-tabs__border">
      <div v-if="highlight.width !== '-1'" class="s-tabs__highlight" :style="highlight" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VNode } from 'vue';

export default Vue.extend({
  name: 's-tabs',

  data() {
    return {
      highlight: {
        left: '0',
        width: '-1',
      },
    };
  },

  methods: {
    setActiveTab(this: any, tab: Vue) {
      this.activeTab = tab;
      this.updateHighlight();
    },

    setHighlight(left: number, width: number) {
      this.highlight = {
        left: `${left}px`,
        width: `${width}px`,
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
  },

  created(this: any) {
    this.activeTab = null;
    this.timerId = null;
  },

  mounted(this: any) {
    this.timerId = setInterval(() => {
      this.updateHighlight();
    }, 250);
  },

  beforeDestroy(this: any) {
    clearInterval(this.timerId);
  },
});
</script>
