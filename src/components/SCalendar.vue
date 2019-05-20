<template>
  <div>
    <transition :name="transition">
      <div
        class="month"
        :key="month"
      >
        <s-calendar-internal :date="date" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DateTime } from 'luxon';
import SCalendarInternal from './internal/SCalendarInternal.vue';

export default Vue.extend({
  name: 'SCelendar',

  components: {
    SCalendarInternal,
  },

  props: {
    date: {
      type: Object as () => DateTime,
      default: () => DateTime.local(),
    },
  },

  data() {
    return {
      transition: '',
    };
  },

  computed: {
    month(): number {
      return this.date.year * 12 + this.date.month;
    },
  },

  watch: {
    month: {
      handler(val, oldVal) {
        if (val < oldVal) {
          this.transition = 'slide-right';
        } else {
          this.transition = 'slide-left';
        }
      },
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.month {
  position: absolute;

  // XXX
  width: calc(100% - 120px);
}

.slide-left-enter-active {
  animation: slide-left-in .5s;
  opacity: 0;
}

.slide-left-leave-active {
  animation: slide-left-out .5s;
}

@keyframes slide-left-in {
  from {
    transform: translateX(150px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-left-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-150px);
    opacity: 0;
  }
}

.slide-right-enter-active {
  animation: slide-right-in .5s;
  opacity: 0;
}

.slide-right-leave-active {
  animation: slide-right-out .5s;
}

@keyframes slide-right-in {
  from {
    transform: translateX(-150px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-right-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(150px);
    opacity: 0;
  }
}
</style>
