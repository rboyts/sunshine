<template>
  <div
    class="s-datepicker"
    :class="{'s-datepicker-menu-active': !!internalValue.preset}"
  >
    <s-datepicker-calendar
      :today="today"
      :mouse-drag="mouseDrag"
      :range="range"
      :value="internalValue"
      @mouse-drag-start="mouseDragStart"
      @mouse-drag-end="mouseDragEnd"
      @mouse-dragging="mouseDragging"
      @mouse-click="mouseClick"
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
import moment, { Moment } from 'moment';
import {
  IMonth,
  ICalendarPeriod,
  IMomentPayload,
  IDateRangeValue,
} from '../types';
import SDatepickerCalendar from './SDatepickerCalendar.vue';
import SDatepickerMenu from './SDatepickerMenu.vue';

// TODO (Robin)
// - Encapsulate mouse event handling in Calendar component?
// - Rename all event handlers, adding 'on' prefix
// - User Moment as event payload, instead of {y,M,d}

export default Vue.extend({
  name: 'SDatepicker',

  components: {
    SDatepickerCalendar,
    SDatepickerMenu,
  },

  props: {
    value: {
      type: Object,
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
      internalValue: undefined as IDateRangeValue | Moment | undefined,
      today: moment(),
      dateContext: moment(),
      mouseDrag: false,
      startDragDate: {} as moment.Moment,
      date: this.value,
      period: this.value,
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
    getDefaultValue(): any {
      const today = moment().startOf('day');
      return this.range ? {
        from: today,
        to: today,
        preset: null,
      } : today;
    },

    setSelectedPeriod(from: Moment, to: Moment) {
      if (!this.range) throw new Error('Expected range to be true');

      this.internalValue = {
        from,
        to,
        preset: null,
      };
    },

    mouseDragStart(payload: IMomentPayload) {
      if (!this.range) return;

      let date = moment([payload.y, (payload.M - 1), payload.d]);

      if (moment(this.period.from).isSame(this.period.to)) {
        // Treat click as period selecting
        this.setSelectedPeriod(this.period.from, date);
      } else {
        this.mouseDrag = true;
        this.startDragDate = date;
      }
    },

    mouseDragEnd(payload: IMomentPayload) {
      if (!this.range) return;
      let date = moment([payload.y, (payload.M - 1), payload.d]);
      if (moment(this.startDragDate).isBefore(date)) {
        this.setSelectedPeriod(this.startDragDate, date);
      } else {
        this.setSelectedPeriod(date, this.startDragDate);
      }
      this.mouseDrag = false;
    },

    mouseDragging(payload: IMomentPayload) {
      if (!this.range) return;
      let date = moment([payload.y, (payload.M - 1), payload.d]);
      if (moment(this.startDragDate).isBefore(date)) {
        this.setSelectedPeriod(this.startDragDate, date);
      } else {
        this.setSelectedPeriod(date, this.startDragDate);
      }
    },

    mouseClick(payload: IMomentPayload) {
      if (this.range) throw new Error('Expected range to be false');

      this.internalValue = moment([payload.y, (payload.M - 1), payload.d]);
    },
  },
});
</script>
