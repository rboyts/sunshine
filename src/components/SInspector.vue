<template>
  <transition name="slide-in">
    <div v-show="value" :class="classes()">
      <div :class="classes('content')">
        <div :class="classes('header')">
          <slot name="header">
          </slot>
        </div>

        <div :class="classes('main')">
          <slot />
        </div>

        <div :class="classes('footer')">
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
