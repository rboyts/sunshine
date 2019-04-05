<template>
  <div
    class="s-datepicker"
    :class="{'s-datepicker-menu-active': filterSelected}"
  >
    <s-datepicker-calendar
      :today="today"
      :calendar="calendar"
      :current-year="calendarYear"
      :current-month="calendarMonth"
      :mouseDrag="mouseDrag"
      :format="format"
      :locale="locale"
      :range="range"
      :selectedPeriod="selectedPeriod"
      :selectedDate="selectedDate"
      @add-coming-month="addComingMonth"
      @add-previous-month="addPreviousMonth"
      @mouse-drag-start="mouseDragStart"
      @mouse-drag-end="mouseDragEnd"
      @mouse-dragging="mouseDragging"
      @mouse-click="mouseClick"
    />
    <s-datepicker-menu
      v-if="menu"
      :today="today"
      :format="format"
      :locale="locale"
      :selectedPeriod="selectedPeriod"
      :selectedDate="selectedDate"
      :filter="filter"
      @set-period="setSelectedPeriod"
      @set-filter="setPeriodFilter"
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
  ICalendarFilter,
} from '../types';
import SDatepickerCalendar from './SDatepickerCalendar.vue';
import SDatepickerMenu from './SDatepickerMenu.vue';

export default Vue.extend({
  name: 's-datepicker',

  components: {
    SDatepickerCalendar,
    SDatepickerMenu,
  },

  data() {
    return {
      calendar: [] as IMonth[],
      today: moment(),
      dateContext: moment(),
      mouseDrag: false,
      startDragDate: {} as moment.Moment,
      date: this.value,
      period: this.value,
    };
  },

  props: {
    filter: {} as () => ICalendarFilter,
    filterSelected: Boolean,
    value: {} as () => any,
    locale: String,
    format: String,
    range: Boolean,
    menu: Boolean,
  },

  watch: {
    value(newVal) {
      this.internalValue = newVal;
    },

    internalValue(newVal, oldVal) {
      if (!newVal) return;
      if (!newVal.from && this.range) {
        this.internalValue.from = moment();
      } else if (!newVal.to && this.range) {
        this.internalValue.to = moment();
      }
      // Redraw calendar if selected date is not in current viewable months
      let compareDate = (this.range) ? newVal.from : newVal;
      let currentMonth = moment([this.calendar[0].year, (this.calendar[0].month - 1), 1]);
      let nextMonth = moment([this.calendar[1].year, (this.calendar[1].month - 1), 1]);
      if (!moment(compareDate).isSame(currentMonth, 'month') &&
        !moment(compareDate).isSame(nextMonth, 'month')) {
        this.dateContext = moment(compareDate);
        this.calendar = this.createMonths();
      }
    },
  },

  computed: {
    internalValue: {
      get(): Moment | ICalendarPeriod {
        if (this.range) {
          return {
            from: this.value.from,
            to: this.value.to,
          };
        }
        return this.value;
      },
      set(newValue: any) {
        if (this.range) {
          this.period = newValue;
        } else {
          this.date = newValue;
        }
      },
    },

    selectedPeriod(): ICalendarPeriod {
      return this.period;
    },

    selectedDate(): Moment {
      return this.date;
    },

    calendarYear(): number {
      return this.dateContext.get('year');
    },

    calendarMonth(): number {
      return this.dateContext.get('month') + 1;
    },
  },

  methods: {
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

    setPeriodFilter(payload: ICalendarFilter) {
      this.$emit('filter-update', payload);
    },

    setSelectedPeriod(from: Moment, to: Moment) {
      this.internalValue = {
        from,
        to,
      };
      this.$emit('input', this.period);
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
      this.$emit('filter-update', { option: '', period: '' });
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
      this.internalValue = moment([payload.y, (payload.M - 1), payload.d]);
      this.$emit('input', this.date);
    },
  },

  mounted() {
    this.calendar = this.createMonths();
  },
});
</script>
