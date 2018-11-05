<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-radio-group',

  provide() {
    return {
      group: this,
    };
  },

  methods: {
    register(this: any, radio: Vue) {
      this.$_radios.push(radio);

      console.log(this.$_radios);
    },
  },

  created(this: any) {
    this.$_radios = [];
  }
});
</script>
