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
        <s-svg v-if="checked" name="radioButtonSelected" :class="classes('selected')" />
      </transition>
    </span>
    <slot/>
  </label>
</template>

<script>
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';
import SSvg from './internal/SSvg.vue';

export default mixins(ClassesMixin).extend({
  name: 's-radio-button',

  components: {
    SSvg,
  },

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
