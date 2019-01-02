<template>
  <label :class="classes(modifiers)"
        @mousedown.native="$event.preventDefault()"
  >
    <input
      type="checkbox"
      :checked="checked"
      :disabled="inactive"
      @change="$emit('change', $event.target.checked)"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    />
    <s-checkable-internal :checked="checked" />
    <span>
      <slot />
    </span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import SCheckableInternal from './internal/CheckableInternal.vue';

export default Vue.extend({
  name: 's-checkbox',

  components: {
    SCheckableInternal,
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

