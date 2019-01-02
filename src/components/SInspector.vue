<template>
  <transition name="slide-in">
    <div v-show="value" class="s-inspector">
      <div class="s-inspector__content">
        <div class="s-inspector__header">
          <slot name="header">
          </slot>
        </div>

        <div class="s-inspector__main">
          <slot />
        </div>

        <div class="s-inspector__footer">
          <slot name="footer">
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 's-inspector',

  props: {
    value: Boolean,
  },
});
</script>
