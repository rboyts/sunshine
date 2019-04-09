<template>
  <div :class="classes()">
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';
import ClassesMixin from './internal/ClassesMixin';

export default Vue.extend({
  name: 'SAccordion',

  inject: ['$validator'],

  mixins: [
    ClassesMixin,
  ],

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
