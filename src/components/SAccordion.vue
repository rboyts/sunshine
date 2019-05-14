<template>
  <div :class="$class()">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SAccordion',

  inject: ['$validator'],

  props: {
    linked: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    registerItem(item) {
      this.items.push(item);
    },

    notifyOpen(openedItem) {
      if (!this.linked) return;

      for (const item of this.items) {
        if (item !== openedItem) {
          item.close();
        }
      }
    },
  },

  created() {
    this.items = [];
  },
});
</script>
