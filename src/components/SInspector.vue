<template>
  <transition name="slide-in">
    <div
      v-if="show"
      :class="classes()"
    >
      <form
        :class="classes('content')"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <div :class="classes('header')">
          <slot name="header" />
        </div>

        <div :class="classes('main')">
          <slot />
        </div>

        <div :class="classes('footer')">
          <slot name="footer" />
        </div>
      </form>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-inspector',
  inheritAttrs: false,

  inject: ['$validator'],

  model: {
    prop: 'show',
    event: 'toggle',
  },

  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
