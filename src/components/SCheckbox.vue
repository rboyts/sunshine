<template>
  <label :class="classes(modifiers)"
    @mousedown.native="$event.preventDefault()"
  >
    <input
      type="checkbox"
      :checked="checked || false"
      :disabled="inactive"
      @change="$emit('change', $event.target.checked)"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    />
    <s-checkable :inactive="inactive" :checked="checked" :hasFocus="hasFocus" />
    <span>
      <slot />
    </span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import SCheckable from './SCheckable.vue';
import mixins from 'vue-typed-mixins';
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
    modifiers(): object {
      return {
        focus: this.hasFocus,
        inactive: this.inactive,
      };
    },
  },
});
</script>

