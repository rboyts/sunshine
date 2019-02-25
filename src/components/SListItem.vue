<template>
  <li :class="classes({selected})" @click="onClick" @accept="onAccept">
    <s-checkable v-if="checkable" :checked="checked" :inactive="inactive" />
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

    inactive: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClick() {
      if (this.inactive) return;

      if (this.checkable) {
        this.$emit('change', !this.checked);
      } else {
        this.$emit('click');
      }
    },

    onAccept() {
      if (this.inactive) return;

      if (this.checkable && !this.checked) {
        this.$emit('change', true);
      }
      this.$emit('click');
    },
  },
});
</script>
