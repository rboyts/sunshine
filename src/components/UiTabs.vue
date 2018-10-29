<template>
  <div class="ui-tabs">
    <slot />
    <div class="ui-tabs--border">
      <div v-if="highlight.width !== '-1'" class="ui-tabs--highlight" :style="highlight" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VNode } from 'vue';

export default Vue.extend({
  name: 'ui-tabs',

  data() {
    return {
      highlight: {
        left: '0',
        width: '-1',
      },
    };
  },

  methods: {
    setActiveTab(tab: Vue) {
      this.activeTab = tab;
      this.updateHighlight();
    },

    updateHighlight() {
      if (!this.activeTab) return;

      let el = this.activeTab.$el;
      if (el == null) return;

      if (this.highlight.width === '-1') {
        this.highlight = {
          left: `${el.offsetLeft + el.offsetWidth / 2}px`,
          width: '0',
        };
      } else {
        this.highlight = {
          left: `${el.offsetLeft}px`,
          width: `${el.offsetWidth}px`,
        };
      }
    }
  },

  created() {
    this.activeTab = null;
    this.timerId = null;
  },

  mounted() {
    this.timerId = setInterval(() => {
      this.updateHighlight();
    }, 250);
  },

  beforeDestroy() {
    clearInterval(this.timerId);
  }
});
</script>
