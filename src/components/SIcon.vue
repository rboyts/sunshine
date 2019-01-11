<template>
  <span :class="classes()"><i :class="iconClasses" /></span>
</template>


<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-icon',

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconClasses(): object {
      return {
        far: true,
        [`fa-${this.name}`]: true,
      };
    },
  },
});
</script>
