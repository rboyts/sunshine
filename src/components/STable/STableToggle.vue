<template>
  <span
    :class="toggleClass"
    @click.stop="$emit('toggle')"
  >
    <s-progress v-if="isLoading" />
    <s-icon
      v-else-if="hasArrow"
      package="sunshine24"
      name="arrow"
    />
    <i v-else>&nbsp;</i>
  </span>
</template>

<script>
export default {
  name: 'STableToggle',

  // Override name used by the `$class` method.
  $_className: 's-table__toggle',

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
      return this.$class({
        loading: this.isLoading,
        open: !this.isLoading && this.isOpen,
      });
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
