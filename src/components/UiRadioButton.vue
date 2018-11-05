<template>
  <label :class="classes">
    <span class="ui-radio-button__box">
      <input
        type="radio"
        :name="name"
        :checked="checked"
        :disabled="inactive"
        @change="onChange"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      />
      <transition name="fade">
        <span v-if="checked">&bull;</span>
      </transition>
    </span>
    <slot/>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import { classHelper } from '@/lib/utils';

export default Vue.extend({
  name: 'ui-radio-button',

  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: Boolean,
    name: {
      type: String,
      default: '',
    },
    inactive: {
      type: Boolean,
      default: false,
    },
  },

  inject: [
    'group',
  ],

  data() {
    return {
      hasFocus: false,
    };
  },

  computed: {
    classes(): object {
      return classHelper('ui-radio-button').apply({
        focus: this.hasFocus,
        inactive: this.inactive,
      });
    },
  },

  methods: {
    onChange(this: any, event: any) {
      this.$emit('change', event.target.checked);
    },
  },

  created(this: any) {
    this.group.register(this);
  }
});
</script>

