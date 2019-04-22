<template>
  <div class="s-datepicker__calendar">
    <div class="s-datepicker__header">
      <div class="flex flex-even s-datepicker__navigation">
        <span
          class="s-datepicker__navigation-arrow back"
          @click="$emit('add-previous-month')"
        >
          <s-icon
            package="sunshine24"
            name="arrow"
          />
        </span>
        <h2>{{ monthNameInHeader }}</h2>
        <span
          class="s-datepicker__navigation-arrow forward"
          @click="$emit('add-coming-month')"
        >
          <s-icon
            package="sunshine24"
            name="arrow"
          />
        </span>
      </div>
      <ul class="s-datepicker__days">
        <li
          class="s-datepicker__day"
          v-for="(day, i) in days"
          :key="`${day}-${i}`"
          :class="{
            'saturday': (i === 5),
            'sunday': (i === 6),
          }"
        >
          {{ day }}
        </li>
      </ul>
    </div>
    <div
      class="s-datepicker__grid__container"
      @wheel="calendarScroll"
    >
      <div
        class="s-datepicker__scroller"
        ref="calendarList"
        @mouseleave="mouseleave"
      >
        <s-datepicker-month
          class="s-datepicker__grid"
          v-for="month in calendar"
          :format="format"
          :range="range"
          :locale="locale"
          :today="today"
          :key="month.month + '-' + month.year"
          :month="month"
          :mouse-drag="mouseDrag"
          :selected-date="range ? undefined : internalValue"
          :selected-period="range ? internalValue : undefined"
          :mouse-drag-outbounds="mouseDragOutbounds"
          @mouse-click="mouseClick"
          @mouse-drag-start="dragStart"
          @mouse-drag-end="dragEnd"
          @mouse-dragging="dragging"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'debounce';
import moment, { Moment } from 'moment';
import {
  IMonth,
  ICalendarPeriod,
  MouseWheelEvent,
  IMomentPayload,
} from '../types';
import SIcon from '../SIcon.vue';
import SDatepickerMonth from './SDatepickerMonth.vue';

export default Vue.extend({
  name: 'SDatepickerCalendar',

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

    calendar: Array as () => IMonth[],
    today: Object as () => Moment,
    currentMonth: Number,
    currentYear: Number,
    mouseDrag: Boolean,
    format: String,
    locale: String,

    range: Boolean,
  },

  data() {
    return {
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'], // TODO i18n

      internalValue: this.value,

      dateContext: moment(),
      activeMonth: this.currentMonth,
      activeYear: this.currentYear,
      lastScrollPosition: 0,
      scrollHeight: 0,
      monthNameInHeader: '',
      mouseDragOutbounds: false,
    };
  },

  watch: {
    calendar: {
      handler(newVal: IMonth[], oldVal: IMonth[]) {
        this.setActiveMonth(newVal);
      },
    },

    value(val) {
      this.internalValue = val;
    },
  },

  methods: {
    mouseleave() {
      // FIXME: Implement properly with capture

      if (!this.mouseDrag) return;

      const { from, to } = this.internalValue;
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

    dragStart(payload: IMomentPayload) {
      this.$emit('mouse-drag-start', payload);
    },

    dragEnd(payload: IMomentPayload) {
      this.$emit('mouse-drag-end', payload);
    },

    dragging(payload: IMomentPayload) {
      this.$emit('mouse-dragging', payload);
    },

    mouseClick(payload: IMomentPayload) {
      this.$emit('mouse-click', payload);
    },

    setActiveMonth(calendar: IMonth[]) {
      this.monthNameInHeader = moment([
        calendar[0].year,
        (calendar[0].month - 1),
      ]).format('MMMM YYYY');
    },

    calendarScroll(event: MouseWheelEvent) {
      let dragDirection = (event.wheelDelta > 0) ? 'down' : 'up';
      if (dragDirection === 'down') {
        this.$emit('add-previous-month');
      } else if (dragDirection === 'up') {
        this.$emit('add-coming-month');
      }
    },
  },
});
</script>
