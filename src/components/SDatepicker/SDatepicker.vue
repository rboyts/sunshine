<template>
  <div
    :class="$class({'menu-active': !!internalValue.preset})"
  >
    <s-datepicker-calendar
      v-model="internalValue"
      :today="today"
      :range="range"
    />
    <s-datepicker-menu
      v-if="withMenu"
      v-model="internalValue"
      :today="today"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DateTime, Interval } from 'luxon';
import { IDatepickerValue } from '../types';
import SDatepickerCalendar from './SDatepickerCalendar.vue';
import SDatepickerMenu from './SDatepickerMenu.vue';

// TODO (Robin)
// - Use DateTime as event payload, instead of {y,M,d}

export default Vue.extend({
  name: 'SDatepicker',

  components: {
    SDatepickerCalendar,
    SDatepickerMenu,
  },

  props: {
    value: {
      type: Object as () => IDatepickerValue,
      required: true,
    },

    range: {
      type: Boolean,
      default: false,
    },

    // XXX Always menu if range?
    withMenu: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      internalValue: undefined as IDatepickerValue | undefined,
      today: DateTime.local().startOf('day'),
    };
  },

  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          this.internalValue = newVal;
        } else {
          this.internalValue = this.getDefaultValue();
        }
      },
      immediate: true,
    },

    internalValue(newVal, oldVal) {
      if (newVal !== this.value) {
        this.$emit('input', newVal);
      }
    },
  },

  methods: {
    getDefaultValue(): IDatepickerValue {
      const today = DateTime.local().startOf('day');
      return this.range ? {
        interval: Interval.fromDateTimes(today, today),
      } : {
        date: today,
      };
    },
  },
});
</script>
