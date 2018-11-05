<template>
  <label :class="classes">
    <span class="ui-checkbox__box">
      <input
        type="checkbox"
        :checked="checked"
        :disabled="inactive"
        @change="$emit('change', $event.target.checked)"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      />
      <transition name="fade">
        <span v-if="checked">&#x2714;</span>
      </transition>
    </span>
    <slot/>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '@/lib/utils';

export default Vue.extend({
  name: 'ui-checkbox',

  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: Boolean,
    inactive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      hasFocus: false,
    };
  },

  computed: {
    classes(): object {
      return classHelper('ui-checkbox').apply({
        focus: this.hasFocus,
        inactive: this.inactive,
      });
    },
  },
});
</script>

