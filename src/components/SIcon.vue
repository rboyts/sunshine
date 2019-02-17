<template>
  <span :class="classes()"><i :class="iconClass" /></span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

import '../icons/style.css';

export default mixins(ClassesMixin).extend({
  name: 's-icon',

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconClass(): string {
      return `icon-${this.name}`;
    },
  },
});
</script>
