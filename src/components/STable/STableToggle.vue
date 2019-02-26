<template>
  <span
    :class="toggleClass"
    @click.stop="$emit('toggle')"
  >
    <s-progress v-if="isLoading" />
    <s-icon v-else-if="hasArrow" package="sunshine24" name="arrow" />
    <i v-else>&nbsp;</i>
  </span>
</template>

<script>
import { ClassesMixin } from '../../lib/utils';

export default {
  name: 's-table__toggle',

  mixins: [
    ClassesMixin,
  ],

  props: {
    node: {
      type: Object,
      required: true,
    },

    isOpen: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    toggleClass() {
      return this.classes({
        loading: this.isLoading,
        open: !this.isLoading && this.isOpen,
      })
    },

    isLoading() {
      return !this.node.hasSubItems && this.isOpen;
    },

    hasArrow() {
      return this.node.hasSubItems || this.node.hasPendingSubItems;
    },
  },
};
</script>

