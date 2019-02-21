<template>
  <label :class="classes(modifiers)">
    <input
      type="radio"
      :name="name"
      :checked="checked"
      :disabled="inactive"
      @change="onChange"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    />

    <span :class="classes('box')">
      <transition name="fade">
        <svg v-if="checked" :class="classes('selected')" width="16" height="16">
          <path
            fill="#1C1C1C"
            d="M8,11 C6.34314575,11 5,9.65685425 5,8 C5,6.34314575
              6.34314575,5 8,5 C9.65685425,5 11,6.34314575 11,8 C11,9.65685425
              9.65685425,11 8,11 Z"
          />
        </svg>
      </transition>
    </span>
    <slot/>
  </label>
</template>

<script>
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-radio-button',

  props: {
    value: String,
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
      checked: false,
      hasFocus: false,
    };
  },

  computed: {
    modifiers() {
      return {
        focus: this.hasFocus,
        inactive: this.inactive,
      };
    },
  },

  methods: {
    onChange(event) {
      this.$emit('change', event.target.checked);
    },
  },

  mounted() {
    this.unregister = this.group.register(this);
  },

  beforeDestroy() {
    this.unregister();
  },
});
</script>
