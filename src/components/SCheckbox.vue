<template>
  <label
    :class="classes(modifiers)"
    @mousedown.native="$event.preventDefault()"
  >
    <input
      type="checkbox"
      :disabled="inactive"
      v-model="isChecked"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    >
    <s-checkable
      :inactive="inactive"
      :checked="isChecked"
      :has-focus="hasFocus"
    />
    <span>
      <slot />
    </span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import SCheckable from './SCheckable.vue';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-checkbox',

  components: {
    SCheckable,
  },

  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: {
      type: Boolean,
      required: false,
    },

    inactive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      hasFocus: false,
      isChecked: this.checked === null ? null : !!this.checked,
    };
  },

  watch: {
    checked(val) {
      this.isChecked = val === null ? null : !!val;
    },

    isChecked(val) {
      if (val !== this.checked) {
        this.$emit('change', val);
      }
    },
  },

  computed: {
    modifiers(): object {
      return {
        focus: this.hasFocus,
        inactive: this.inactive,
      };
    },
  },
});
</script>
