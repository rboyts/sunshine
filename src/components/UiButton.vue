<template>
  <button class="btn" :class="buttonClass" v-on="$listeners">
    <slot />
    <span style="float: right">
      <slot name="right" />
    </span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-button',
  inheritAttrs: true,

  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    buttonClass(): any {
      return {
        'btn': true,
        'btn-small': this.small,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.btn {
  margin: 0;
  padding: 8px;
  border-radius: 3px;
  font-size: 14px;
  border: 1px solid #999;
  background-color: #f1f1f1;
}

.btn-small {
  padding: 4px 8px;
}

.btn:hover {
  background-color: #f8f8f8;
}
</style>
