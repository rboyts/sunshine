<template>
  <span
    :class="classes()"
    v-on="$listeners"
  ><span
    :style="iconStyle"
    :class="iconClass"
  />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import ClassesMixin from './internal/ClassesMixin';

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

    rotate: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    iconClass(): string {
      return `${this.package}-${this.name}`;
    },

    iconStyle(): any {
      return {
        display: 'inline-block',
        transform: `rotate(${this.rotate}deg)`,
      };
    },
  },
});
</script>
