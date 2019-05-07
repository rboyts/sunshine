<template>
  <div :class="classes()">
    <router-link
      :to="to"
      class="s-link"
    >
      <span :class="classes('label')">
        <span
          :class="classes('icon')"
          class="sunshine24-navigateback"
        />
        <slot />
      </span>
    </router-link>
  </div>
</template>

<script>
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import ClassesMixin from './internal/ClassesMixin';

export default mixins(ClassesMixin).extend({
  name: 'SBreadcrumb',

  props: {
    to: {
      type: String,
      required: true,
    },
  },
});
</script>
