<template>
  <li class="s-list__item" @click="onClick">
    <s-checkable-internal v-if="checkable" :checked="checked" />
    <slot />
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import SCheckableInternal from './internal/CheckableInternal.vue';

export default Vue.extend({
  name: 's-list-item',

  model: {
    prop: 'checked',
    event: 'change',
  },

  components: {
    SCheckableInternal,
  },

  props: {
    checkable: {
      type: Boolean,
      default: false,
    },

    checked: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClick() {
      if (this.checkable) {
        this.$emit('change', !this.checked);
      }
      this.$emit('click');
    },
  },
});
</script>
