<template>
  <div :class="$class()">
    <router-link
      :to="to"
      class="s-link"
    >
      <span :class="$class('label')">
        <span
          :class="$class('icon')"
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

export default Vue.extend({
  name: 'SBreadcrumb',

  props: {
    to: {
      type: String,
      required: true,
    },
  },
});
</script>
