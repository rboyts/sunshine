<template>
  <div :class="$class('calendar')">
    <div :class="$class('header')">
      <div :class="$class('navigation')">
        <span
          :class="$class('navigation-arrow', { back: true })"
          @click="gotoPreviousMonth"
        >
          <s-icon
            package="sunshine24"
            name="arrow"
          />
        </span>
        <h2>{{ monthNameInHeader }}</h2>
        <span
          :class="$class('navigation-arrow', { forward: true })"
          @click="gotoNextMonth"
        >
          <s-icon
            package="sunshine24"
            name="arrow"
          />
        </span>
      </div>
      <ul :class="$class('days')">
        <li
          v-for="(day, i) in days"
          :key="`${day}-${i}`"
          :class="$class('day', {
            'saturday': (i === 5),
            'sunday': (i === 6),
          })"
        >
          {{ day }}
        </li>
      </ul>
    </div>

    <transition :name="transition">
      <div
        :class="$class('grid', 'container')"
        :key="dateContext.valueOf()"
        @wheel="onCalendarScroll"
      >
        <div
          :class="$class('scroller')"
          ref="calendarList"
          @mouseleave="onMouseLeave"
        >
          <s-datepicker-month
            v-for="month in calendar"
            :class="$class('grid')"
            :range="range"
            :today="today"
            :key="month.value"
            :date-context="month"
            :mouse-drag="mouseDrag"
            :value="value"
            @mouse-click="onMouseClick"
            @mouse-drag-start="onDragStart"
            @mouse-drag-end="onDragEnd"
            @mouse-dragging="onMouseDragging"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import debounce from 'debounce';
import { DateTime, Interval, Info } from 'luxon';
import {
  MouseWheelEvent,
  IDatepickerValue,
} from '../types';
import SIcon from '../SIcon.vue';
import SCalendarMixin from './SCalendarMixin';
import SDatepickerMonth from './SDatepickerMonth.vue';

export default mixins(SCalendarMixin).extend({
  name: 'SDatepickerCalendar',

  // CSS class names start with 's-datepicker' instead of 's-datepicker-calendar'
  $_className: 's-datepicker',

  components: {
    SDatepickerMonth,
    SIcon,
  },

  props: {
    /**
     * Input value, same as for SDatepicker.
     */
    value: {
      type: Object as () => IDatepickerValue,
      required: true,
    },

    today: {
      type: Object as () => DateTime,
      required: true,
    },

    range: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      days: Info.weekdays('narrow'),

      transition: '',

      internalValue: this.value,

      mouseDrag: false,
      startDragDate: undefined as DateTime | undefined,
      lastScrollPosition: 0,
      scrollHeight: 0,
    };
  },

  computed: {
    monthNameInHeader(): string {
      return this.dateContext.toFormat('MMMM yyyy');
    },
  },

  watch: {
    value(val) {
      this.internalValue = val;
    },

    internalValue(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }

      let compareDate = this.range ? val.interval.start : val.date;
      this.ensureSelectionVisible(compareDate);
    },

    dateContext(next, prev) {
      if (next < prev) {
        this.transition = 'slide-down';
      } else {
        this.transition = 'slide-up';
      }
    },
  },

  methods: {
    setSelectedPeriod(from: DateTime, to: DateTime) {
      if (!this.range) throw new Error('Expected range to be true');

      this.internalValue = {
        interval: Interval.fromDateTimes(from, to),
      };
    },

    onMouseLeave() {
      // FIXME: Implement properly with capture
      this.mouseDrag = false;
    },

    onDragStart(date: DateTime) {
      if (!this.range) return;

      if (this.value.interval && this.value.interval.hasSame('day')) {
        // Treat click as period selecting
        // FIXME
        this.setSelectedPeriod(this.value.interval.start, date);
      } else {
        this.mouseDrag = true;
        this.startDragDate = date;
      }
    },

    onDragEnd(date: DateTime) {
      if (!this.range) return;
      this.onMouseDragging(date);
      this.mouseDrag = false;
    },

    onMouseDragging(date: DateTime) {
      if (!this.range || !this.startDragDate) return;
      if (this.startDragDate < date) {
        this.setSelectedPeriod(this.startDragDate, date);
      } else {
        this.setSelectedPeriod(date, this.startDragDate);
      }
    },

    onMouseClick(date: DateTime) {
      if (this.range) throw new Error('Expected range to be false');

      this.internalValue = { date };
    },

    onCalendarScroll(event: MouseWheelEvent) {
      if (event.wheelDelta > 0) {
        this.gotoPreviousMonth();
      } else {
        this.gotoNextMonth();
      }
    },
  },
});
</script>
