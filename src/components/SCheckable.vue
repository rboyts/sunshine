<template>
  <span :class="classes(modifiers)">
    <transition name="fade">
      <s-svg v-if="iconName" :key="iconName" :name="iconName" :class="classes('checkmark')" />
    </transition>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';
import SSvg from './internal/SSvg.vue';

export default mixins(ClassesMixin).extend({
  name: 's-checkable',

  components: {
    SSvg,
  },

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
          return 'checkMark';
        case null:
          return 'checkMarkMultiple';
        default:
          return null;
      }
    },
  },
});
</script>

