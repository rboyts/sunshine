<template>
  <li :class="classes()" @click="onClick">
    <s-checkable v-if="checkable" :checked="checked" />
    <slot />
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';
import SCheckable from './SCheckable.vue';

export default mixins(ClassesMixin).extend({
  name: 's-list-item',

  model: {
    prop: 'checked',
    event: 'change',
  },

  components: {
    SCheckable,
  },

  props: {
    checkable: {
      type: Boolean,
      default: false,
    },

    checked: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClick() {
      if (this.checkable) {
        this.$emit('change', !this.checked);
      } else {
        this.$emit('click');
      }
    },
  },
});
</script>
