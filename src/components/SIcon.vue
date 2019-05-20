<template>
  <span
    :class="$class()"
    v-on="$listeners"
  ><span
    :style="iconStyle"
    :class="iconClass"
  />
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';

import '../icons/icon54/style.css';
import '../icons/sunshine24/css/sunshine24-embedded.css';


export default Vue.extend({
  name: 'SIcon',

  props: {
    package: {
      type: String,
      default: 'icon',
    },

    name: {
      type: String,
      required: true,
    },

    rotate: {
      type: Number,
      default: undefined,
    },
  },

  computed: {
    iconClass(): string {
      return `${this.package}-${this.name}`;
    },

    iconStyle(): any {
      if (!this.rotate) return {};

      return {
        display: 'inline-block',
        transform: `rotate(${this.rotate}deg)`,
      };
    },
  },
});
</script>
