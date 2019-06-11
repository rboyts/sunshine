<template>
  <li
    :class="$class({selected})"
    :data-search-string="searchString"
    @click="onClick"
    @accept="onAccept"
  >
    <s-checkable
      v-if="checkable"
      :checked="checked"
      :inactive="inactive"
    />
    <slot />
  </li>
</template>

<script lang="ts">
import Vue from 'vue';
import SCheckable from './SCheckable.vue';

export default Vue.extend({
  name: 'SListItem',

  model: {
    prop: 'checked',
    event: 'change',
  },

  components: {
    SCheckable,
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

    inactive: {
      type: Boolean,
      default: false,
    },

    selected: {
      type: Boolean,
      default: false,
    },

    searchString: {
      type: String,
      default: undefined,
    },
  },

  methods: {
    onClick(event: MouseEvent) {
      if (this.inactive) return;

      if (this.checkable) {
        this.$emit('change', !this.checked);
      } else {
        this.$emit('click', event);
      }
    },

    onAccept() {
      if (this.inactive) return;

      if (this.checkable && !this.checked) {
        this.$emit('change', true);
      }
      this.$emit('click');
    },
  },
});
</script>
