<template>
  <span v-html="svg" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-svg',

  props: {
    name: String,
  },

  computed: {
    svg(): string {
      return require(`html-loader!../../assets/svg/${this.name}.svg`);
    },
  },
});
</script>
