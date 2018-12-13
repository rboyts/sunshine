<template>
  <ul :class="listClass">
    <slot />
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '../lib/utils';

const listClassHelper = classHelper('s-list');

export default Vue.extend({
  name: 's-list',

  computed: {
    listClass() {
      return listClassHelper({});
    },
  },
});
</script>
