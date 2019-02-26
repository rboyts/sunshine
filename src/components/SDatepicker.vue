<template>
  <div class="s-datepicker" :class="{includeMenu: menu}">
    <s-datepicker-calendar
      :today="today"
      :calendar="calendar"
      :current-year="yearNum"
      :current-month="monthKey + 1"
      :mouseDrag="mouseDrag"
      :format="format"
      :locale="locale"
      :selectedPeriod="selectedPeriod"
      :selectedDate="selectedDate"
      @addComingMonth="addComingMonth"
      @addPreviousMonth="addPreviousMonth"
      @mouseDragEvent="mouseDragEvent"
    />
    <s-datepicker-menu
      v-if="menu"
      :today="today"
      :format="format"
      @setSelectedPeriod="selectDateOfPeriod"
     />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod } from './types';
import SDatepickerCalendar from './internal/SDatepickerCalendar.vue';
import SDatepickerMenu from './internal/SDatepickerMenu.vue';

export default Vue.extend({
  name: 's-datepicker',

  components: {
    SDatepickerCalendar,
    SDatepickerMenu,
  },

  props: {
    value: String,
    locale: String,
    format: String,
    date: Object as () => Moment,
    from: Object as () => Moment,
    to: Object as () => Moment,
    includeMenu: {
      type: Boolean,
      default: false,
    },
    rangeSelect: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    value(newVal, oldVal) {
      // Validate date?
      // TODO: all
      // this.dateContext = moment(newVal, 'DD.MM.YYYY');
      // this.calendar = this.createMonths();
      // this.selectedPeriod.from = moment(newVal, 'DD.MM.YYYY');
      // this.selectedPeriod.to = moment(newVal, 'DD.MM.YYYY');
    },
  },

  data() {
    return {
      calendar: [] as IMonth[],
      today: moment(),
      dateContext: moment(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      mouseDrag: false,
    };
  },

  computed: {
    selectedPeriod(): ICalendarPeriod {
      return {
        from: this.from,
        to: this.to,
      };
    },

    selectedDate(): Moment {
      return this.date;
    },

    menu(): boolean {
      return this.includeMenu;
    },

    range(): boolean {
      return this.rangeSelect;
    },

    year(): string {
      return this.dateContext.format('Y');
    },

    yearNum(): number {
      return this.dateContext.get('year');
    },

    month(): string {
      return this.dateContext.format('MMMM');
    },

    monthKey(): number {
      return this.dateContext.get('month');
    },

    daysInMonth(): number {
      return this.dateContext.daysInMonth();
    },

    currentDate(): number {
      return this.dateContext.get('date');
    },

    initialDate(): number {
      return this.today.get('date');
    },

    initialMonth(): string {
      return this.today.format('MMMM');
    },

    initialYear(): string {
      return this.today.format('Y');
    },
  },

  methods: {

    addPreviousMonth() {
      let firstMonth = this.calendar[0];
      let firstMonthDate = moment(`${firstMonth.year}-${this.stringifySingleDigit(firstMonth.month)}-01`);
      let previousMonth = moment(firstMonthDate).subtract(1, 'months');

      this.calendar.unshift(this.addMonthItem(previousMonth.get('year'), previousMonth.get('month') + 1));
      this.calendar.pop();
    },

    addComingMonth() {
      let lastMonth = this.calendar[this.calendar.length - 1];
      let lastMonthDate = moment(`${lastMonth.year}-${this.stringifySingleDigit(lastMonth.month)}-01`);
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
        daysInMonth: moment(`${year}-${this.stringifySingleDigit(month)}`).daysInMonth(),
        previousMonthDays: this.addOverlapDays(year, month, this.offsetStartDay(year, month)),
        year,
      };
    },

    addWeekNumbers(year: number, month: number) {
      let weekNumbers = [] as number[];
      for (let c = 1, d = (moment(`${year}-${this.stringifySingleDigit(month)}`).daysInMonth()); c <= d; c++) {
        let week = moment(`${year}-${this.stringifySingleDigit(month)}-${this.stringifySingleDigit(c)}`).week();
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
        dateToSubtractFrom = moment(`${lastYear}-12`).daysInMonth();
      } else {
        dateToSubtractFrom = moment(`${year}-${this.stringifySingleDigit(month - 1)}`).daysInMonth();
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
      let year = this.dateContext.get('year');
      // let present = this.monthKey + 1;
      let present = this.dateContext.get('month') + 1;
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

    stringifySingleDigit(key: number): string {
      let digitAsString;

      if (key <= 9) {
        digitAsString = `0${key}`;
      } else {
        digitAsString = `${key}`;
      }
      return digitAsString;
    },

    offsetStartDay(year: number, month: number) {
      return moment(`${year}-${this.stringifySingleDigit(month)}`)
        .startOf('month')
        .weekday();
    },

    offsetEndDay(year: number, month: number) {
      return moment(`${year}-${this.stringifySingleDigit(month)}`)
        .endOf('month')
        .weekday();
    },

    selectDateOfPeriod(from: Moment, to: Moment) {
      this.selectedPeriod = {
        from,
        to,
      };
    },

    mouseDragEvent(date: Moment, event: string) {
      // if (!this.range) return;
      // if (event === 'dragStart' || !moment.isMoment(this.selectedDate)) {
      //   this.mouseDrag = true;
      //   this.selectedDate = date;
      // } else if (event === 'dragEnd') {
      //   if (moment(this.selectedDate).isBefore(date)) {
      //     this.selectedPeriod = {
      //       from: this.selectedDate,
      //       to: date,
      //     };
      //   } else {
      //     this.selectedPeriod = {
      //       from: date,
      //       to: this.selectedDate,
      //     };
      //   }
      //   this.mouseDrag = false;
      //   this.selectedDate = null;
      // } else if (moment(this.selectedDate).isBefore(date)) {
      //   this.selectedPeriod = {
      //     from: this.selectedDate,
      //     to: date,
      //   };
      // } else {
      //   this.selectedPeriod = {
      //     from: date,
      //     to: this.selectedDate,
      //   };
      // }
    },
  },

  mounted() {
    this.calendar = this.createMonths();
  },
});
</script>
