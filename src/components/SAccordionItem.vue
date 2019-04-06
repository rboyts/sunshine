<template>
  <div :class="classes()">
    <a
      href="#"
      :class="classes('heading', {invalid})"
      @_click="$emit('click')"
      @click="onClick"
    >
      <slot name="heading">
        {{ heading }}
      </slot>
      <s-icon
        package="sunshine24"
        name="arrow"
        :class="classes('chevron', chevronOptions)"
      />
    </a>

    <div
      v-show="showBody"
      :class="classes('body', bodyOptions)"
      :style="bodyStyle"
      @transitionend="onTransitionEnd"
    >
      <div
        ref="inner"
        :class="classes('content')"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { ClassesMixin } from '../lib/utils';
import SIcon from './SIcon.vue';

export default Vue.extend({
  name: 'SAccordionItem',

  inject: ['$validator'],

  mixins: [
    ClassesMixin,
  ],

  components: {
    SIcon,
  },

  props: {
    heading: {
      type: String,
      default: '',
    },

    // Set to true, if one input inside failed form validation
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
