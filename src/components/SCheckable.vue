<template>
  <span
    :class="$class(modifiers)"
    v-on="$listeners"
  >
    <transition name="fade">
      <svg
        v-if="checked === true"
        :class="$class('checkmark')"
        width="16"
        height="16"
      >
        <path
          fill="#1E1E1E"
          d="M11.5396349,5.27801179 C11.938378,4.89588301
            12.5713997,4.90935156 12.9535285,5.30809464 C13.3356573,5.70683771
            13.3221887,6.33985942 12.9234457,6.72198821 L8.74953261,10.7219882
            C8.36273359,11.0926706 7.75252091,11.0926706 7.36572189,10.7219882
            L4.30809464,7.79176209 C3.90935156,7.40963331 3.89588301,6.7766116
            4.27801179,6.37786852 C4.66014058,5.97912545 5.29316229,5.9656569
            5.69190536,6.34778568 L8.05762725,8.61493582 L11.5396349,5.27801179 Z"
        />
      </svg>

      <svg
        v-else-if="checked === null"
        :class="$class('checkmark')"
        width="16"
        height="16"
      >
        <path
          fill="#1C1C1C"
          d="M5,7 L11,7 C11.5522847,7 12,7.44771525 12,8 C12,8.55228475
            11.5522847,9 11,9 L5,9 C4.44771525,9 4,8.55228475 4,8 C4,7.44771525
            4.44771525,7 5,7 Z"
        />
      </svg>

    </transition>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';

export default Vue.extend({
  name: 'SCheckable',

  props: {
    checked: Boolean,

    inactive: {
      type: Boolean,
      default: false,
    },

    hasFocus: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    modifiers(): object {
      return {
        focus: this.hasFocus,
        inactive: this.inactive,
      };
    },

    iconName(): string | null {
      switch (this.checked) {
        case true:
          return 'checkmark';
        case null:
          return 'checkmarkmultiple';
        default:
          return null;
      }
    },
  },
});
</script>
