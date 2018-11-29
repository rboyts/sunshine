<template>
  <transition name="slide-in">
    <div v-show="value" class="ui-inspector">
      <div class="flex flex-column">
        <div class="ui-inspector__header">
          <slot name="header">
          </slot>
        </div>

        <div class="ui-inspector__main flex-grow">
          <slot />
        </div>

        <div class="ui-inspector__footer">
          <slot name="footer">
            Default footer
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-inspector',

  props: {
    value: Boolean,
  },
});
</script>
