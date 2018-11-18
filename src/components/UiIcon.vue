<template>
  <span :class="classes">{{ icon }}</span>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-icon',

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    classes() {
      return 'ui-icon';
    },

    icon() {
      switch (this.name) {
        case 'hourglass':
          return String.fromCharCode(0x231B);
        default:
          return String.fromCharCode(0x2318);
      }
    },
  },
});
</script>
