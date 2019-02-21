<template>
  <span :class="classes()"><span :class="iconClass" /></span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

import '../icons/icon54/style.css';
import '../icons/sunshine24/css/sunshine24-embedded.css';


export default mixins(ClassesMixin).extend({
  name: 's-icon',

  props: {
    package: {
      type: String,
      default: 'icon',
    },

    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconClass(): string {
      return `${this.package}-${this.name}`;
    },
  },
});
</script>
