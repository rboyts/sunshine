<template>
  <div :class="classes()">
    <slot />
    <div :class="classes('border')">
      <div v-if="highlight.width !== '-1'" :class="classes('highlight')" :style="highlight" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
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
