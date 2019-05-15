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
  IMonth,
  ICalendarPeriod,
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

    mouseDrag: {
      type: Boolean,
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
      let compareDate = this.range ? this.value.from : this.value;
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
    onMouseLeave() {
      // FIXME: Implement properly with capture

      if (!this.mouseDrag) return;

      const { from, to } = this.value;
      if (from && to) {
        // Make sure we don't interupt the dragging event at a wrong time
        // emit correct events to cancel mouseDrag
        this.$emit('mouse-drag-start', {
          y: moment(from).year(),
          M: (moment(from).month() + 1),
          d: moment(from).date(),
        });
        this.$emit('mouse-drag-end', {
          y: moment(to).year(),
          M: (moment(to).month() + 1),
          d: moment(to).date(),
        });
      }
    },

    onDragStart(payload: IMomentPayload) {
      this.$emit('mouse-drag-start', payload);
    },

    onDragEnd(payload: IMomentPayload) {
      this.$emit('mouse-drag-end', payload);
    },

    onMouseDragging(payload: IMomentPayload) {
      this.$emit('mouse-dragging', payload);
    },

    onMouseClick(payload: IMomentPayload) {
      this.$emit('mouse-click', payload);
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
