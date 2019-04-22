<template>
  <div
    class="s-datepicker"
    :class="{'s-datepicker-menu-active': !!internalValue.preset}"
  >
    <s-datepicker-calendar
      :today="today"
      :calendar="calendar"
      :current-year="calendarYear"
      :current-month="calendarMonth"
      :mouse-drag="mouseDrag"
      :format="format"
      :locale="locale"
      :range="range"
      :value="internalValue"
      @add-coming-month="addComingMonth"
      @add-previous-month="addPreviousMonth"
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

    locale: String,
    format: String,

    // XXX Always menu if range?
    withMenu: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      internalValue: undefined as IDateRangeValue | Moment | undefined,
      calendar: [] as IMonth[],
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

      this.ensureSelectionVisible();
    },
  },

  computed: {
    calendarYear(): number {
      return this.dateContext.get('year');
    },

    calendarMonth(): number {
      return this.dateContext.get('month') + 1;
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

    addPreviousMonth() {
      let firstMonth = this.calendar[0];
      let firstMonthDate = moment([firstMonth.year, (firstMonth.month - 1), 1]);
      let previousMonth = moment(firstMonthDate).subtract(1, 'months');

      this.calendar.unshift(this.addMonthItem(previousMonth.get('year'), previousMonth.get('month') + 1));
      this.calendar.pop();
    },

    addComingMonth() {
      let lastMonth = this.calendar[this.calendar.length - 1];
      let lastMonthDate = moment([lastMonth.year, (lastMonth.month - 1), 1]);
      let nextMonth = moment(lastMonthDate).add(1, 'months');

      this.calendar.push(this.addMonthItem(nextMonth.get('year'), nextMonth.get('month') + 1));
      this.calendar.shift();
    },

    addMonthItem(year: number, month: number): IMonth {
      return {
        month,
        weeksInMonth: this.addWeekNumbers(year, month),
        firstDay: this.offsetStartDay(year, month),
        lastDay: this.offsetEndDay(year, month),
        daysInMonth: moment([year, (month - 1)]).daysInMonth(),
        previousMonthDays: this.addOverlapDays(year, month, this.offsetStartDay(year, month)),
        year,
      };
    },

    addWeekNumbers(year: number, month: number) {
      let weekNumbers = [] as number[];
      for (let c = 1, d = (moment([year, (month - 1)]).daysInMonth()); c <= d; c++) {
        let week = moment(moment([year, (month - 1), c])).week();
        if (!weekNumbers.includes(week)) {
          weekNumbers.push(week);
        }
      }
      return weekNumbers;
    },

    addOverlapDays(year: number, month: number, firstDay: number) {
      let previousMonthDays: number[] = [];
      let dateToSubtractFrom: number;
      if (month === 1) {
        // If january, get last day from previous years last month
        let lastYear = year - 1;
        dateToSubtractFrom = moment([lastYear, 11]).daysInMonth();
      } else {
        dateToSubtractFrom = moment([year, (month - 2)]).daysInMonth();
      }
      if (firstDay > 0) {
        // Add lastdays from previous month
        for (let c = firstDay - 1, d = 0; c >= d; c--) {
          previousMonthDays.push(dateToSubtractFrom - c);
        }
      }
      return previousMonthDays;
    },

    createMonths() {
      let year = this.calendarYear;
      let present = this.calendarMonth;
      let months = [];
      for (let a = 0, b = 2; a < b; a++) {
        let tmpMonth: number;
        let tmpYear: number;
        if ((present + a) > 12) {
          tmpMonth = (present + a) - 12;
          tmpYear = year + 1;
          months.push(this.addMonthItem(tmpYear, tmpMonth));
        } else {
          tmpMonth = present + a;
          tmpYear = year;
          months.push(this.addMonthItem(tmpYear, tmpMonth));
        }
      }
      return months;
    },

    offsetStartDay(year: number, month: number) {
      return moment([year, (month - 1)])
        .startOf('month')
        .weekday();
    },

    offsetEndDay(year: number, month: number) {
      return moment([year, (month - 1)])
        .endOf('month')
        .weekday();
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

    ensureSelectionVisible() {
      let compareDate = this.range ? this.internalValue.from : this.internalValue;
      let currentMonth = moment([this.calendar[0].year, (this.calendar[0].month - 1), 1]);
      let nextMonth = moment([this.calendar[1].year, (this.calendar[1].month - 1), 1]);
      if (!moment(compareDate).isSame(currentMonth, 'month') &&
        !moment(compareDate).isSame(nextMonth, 'month')) {
        this.dateContext = moment(compareDate);
        this.calendar = this.createMonths();
      }
    },
  },

  mounted() {
    this.calendar = this.createMonths();
  },
});
</script>
