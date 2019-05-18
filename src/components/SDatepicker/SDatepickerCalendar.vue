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
            :key="month.month + '-' + month.year"
            :month="month"
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
import moment, { Moment } from 'moment';
import {
  MouseWheelEvent,
  IMomentPayload,
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
      type: Object,
      required: true,
    },

    today: {
      type: Object as () => Moment,
      required: true,
    },

    range: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'], // TODO i18n

      transition: '',

      internalValue: this.value,

      mouseDrag: false,
      startDragDate: {} as moment.Moment,
      lastScrollPosition: 0,
      scrollHeight: 0,
    };
  },

  computed: {
    monthNameInHeader(): string {
      return this.dateContext.format('MMMM YYYY');
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

      let compareDate = this.range ? val.from : val;
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
    setSelectedPeriod(from: Moment, to: Moment) {
      if (!this.range) throw new Error('Expected range to be true');

      this.internalValue = {
        from,
        to,
        preset: null,
      };
    },

    onMouseLeave() {
      // FIXME: Implement properly with capture
      this.mouseDrag = false;
    },

    onDragStart(payload: IMomentPayload) {
      if (!this.range) return;

      let date = moment([payload.y, (payload.M - 1), payload.d]);

      if (moment(this.value.from).isSame(this.value.to)) {
        // Treat click as period selecting
        // FIXME
        this.setSelectedPeriod(this.value.from, date);
      } else {
        this.mouseDrag = true;
        this.startDragDate = date;
      }
    },

    onDragEnd(payload: IMomentPayload) {
      if (!this.range) return;
      this.onMouseDragging(payload);
      this.mouseDrag = false;
    },

    onMouseDragging(payload: IMomentPayload) {
      if (!this.range) return;
      let date = moment([payload.y, (payload.M - 1), payload.d]);
      if (moment(this.startDragDate).isBefore(date)) {
        this.setSelectedPeriod(this.startDragDate, date);
      } else {
        this.setSelectedPeriod(date, this.startDragDate);
      }
    },

    onMouseClick(payload: IMomentPayload) {
      if (this.range) throw new Error('Expected range to be false');

      this.internalValue = moment([payload.y, (payload.M - 1), payload.d]);
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
