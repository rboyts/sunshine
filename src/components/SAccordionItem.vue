<template>
  <div :class="$class()">
    <a
      href="#"
      :class="$class('heading')"
      @_click="$emit('click')"
      @click="onClick"
    >
      <span :class="$class('title')">
        <slot name="heading">
          {{ heading }}
        </slot>
      </span>
      <s-icon
        v-if="invalid"
        package="sunshine24"
        name="warning"
        :class="$class('warning')"
      />
      <s-icon
        package="sunshine24"
        name="arrow"
        :class="$class('chevron', chevronOptions)"
      />
    </a>

    <div
      v-show="showBody"
      :class="$class('body', bodyOptions)"
      :style="bodyStyle"
      @transitionend="onTransitionEnd"
    >
      <div
        ref="inner"
        :class="$class('content')"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SIcon from './SIcon.vue';

export default Vue.extend({
  name: 'SAccordionItem',

  inject: ['$validator'],

  components: {
    SIcon,
  },

  props: {
    heading: {
      type: String,
      default: '',
    },

    invalid: {
      type: Boolean,
      default: false,
    },

    defaultOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      open: this.defaultOpen,
      height: 0,
      transitioning: false,
    };
  },

  watch: {
    async open(val) {
      if (val) {
        this.$parent.notifyOpen(this);
      }

      // Make sure height is defined at the beginning of the animation
      if (!val) {
        this.height = this.$refs.inner.offsetHeight;
      }

      this.transitioning = true;

      // Need to wait for height to be correct
      await Vue.nextTick();

      // We read offsetHeight from the element, even in the case when
      // we're setting height to 0, because accessing this property will
      // actually force the browser to do a 'reflow', making sure the height
      // is set to the initial value, before we change it. If we don't do this,
      // the transition may not always occur.
      // Ref: https://stackoverflow.com/a/16575811/137627
      const height = this.$refs.inner.offsetHeight;

      if (val) {
        this.height = height;
      } else {
        this.height = 0;
      }
    },
  },

  computed: {
    showBody() {
      return this.open || this.transitioning;
    },

    chevronOptions() {
      return { rotate: !this.open };
    },

    bodyOptions() {
      return {
        open: this.open,
        transitioning: this.transitioning,
      };
    },

    bodyStyle() {
      if (!this.transitioning) return {};

      return {
        height: `${this.height}px`,
        opacity: this.height === 0 ? 0 : 1,
      };
    },
  },

  methods: {
    onClick() {
      this.open = !this.open;
    },

    onTransitionEnd() {
      this.transitioning = false;
    },

    close() {
      this.open = false;
    },
  },

  mounted() {
    this.$parent.registerItem(this);
  },
});
</script>
