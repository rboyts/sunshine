<template>
  <span :class="classes(modifiers)">
    <transition name="fade">
      <i v-if="iconName"
        :key="iconName"
        :class="[`sunshine16-${iconName}`, classes('checkmark')]" />
    </transition>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-checkable',

  props: {
    checked: Boolean,

    inactive: {
      type: Boolean,
      default: false,
    },

    hasFocus: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    modifiers(): object {
      return {
        focus: this.hasFocus,
        inactive: this.inactive,
      };
    },

    iconName(): string | null {
      switch (this.checked) {
        case true:
          return 'checkmark';
        case null:
          return 'checkmarkmultiple';
        default:
          return null;
      }
    },
  },
});
</script>
