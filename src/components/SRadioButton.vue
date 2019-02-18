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
        <i v-if="checked" name=""
          class="sunshine16-radiobtnselected"
          :class="classes('selected')" />
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
