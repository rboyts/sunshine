<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :width="width" :height="height" v-html="content"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-svg',

  props: {
    name: String,
  },

  data() {
    return {
      content: '',
      width: '',
      height: '',
    };
  },

  watch: {
    name: {
      handler() {
        const svg = require(`html-loader!../../assets/svg/${this.name}.svg`);

        const parser = new DOMParser();
        const dom = parser.parseFromString(svg, 'image/svg+xml');
        const doc = dom.documentElement;

        this.content = doc.innerHTML;
        this.width = doc.getAttribute('width') as string;
        this.height = doc.getAttribute('height') as string;
      },
      immediate: true,
    },
  },
});
</script>
