<template>
  <div class="s-datepicker">
    <s-datepicker-calendar 
      :today="today.format('YYYY-MM-DD')"
      :calendar="calendar"
      :current-year="yearNum"
      :current-month="monthKey + 1"
      :selected-period="selectedPeriod"
      @click="selectDateOfPeriod"
      @addComingMonth="addComingMonth"
      @addPreviousMonth="addPreviousMonth"
    />
    <s-datepicker-menu
      :today="today"
      :selected-period="selectedPeriod"
      @setSelectedPeriod="selectDateOfPeriod"
     />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth } from './types';
import SDatepickerCalendar from './internal/SDatepickerCalendar.vue';
import SDatepickerMenu from './internal/SDatepickerMenu.vue';

// TODO: Get local from system config
// NB! also applicable to i18n of text
moment.locale('nb');

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
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      selectedDate: null as Moment | null,
      selectedPeriod: {
        from: null as Moment | null ,
        to: null as Moment | null,
      },
    };
  },
  computed: {
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
      let firstMonthDate = moment(firstMonth.year + '-' + firstMonth.month + '-01');
      let previousMonth = moment(firstMonthDate).subtract(1, 'months');

      this.calendar.unshift(this.addMonthItem(previousMonth.get('year'), previousMonth.get('month') + 1));
      this.calendar.pop();
    },

    addComingMonth() {
      let lastMonth = this.calendar[this.calendar.length - 1];
      let lastMonthDate = moment(lastMonth.year + '-' + lastMonth.month + '-01');
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
        daysInMonth: moment(year + '-' + month).daysInMonth(),
        previousMonthDays: this.addOverlapDays(year, month, this.offsetStartDay(year, month)),
        year,
      };
    },

    addWeekNumbers(year: number, month: number) {
      let weekNumbers = [] as number[];
      for (let c = 0, d = (moment(year + '-' + this.stringifyMonth(month)).daysInMonth() - 1); c <= d; c++) {
        // TODO: Fix moment complaining about "[date] not in a recognized RFC2822 or ISO format"
        let week = moment(year + '-' + this.stringifyMonth(month) + '-' + (c + 1)).week();
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
        dateToSubtractFrom = moment(lastYear + '-12').daysInMonth();
      } else {
        dateToSubtractFrom = moment(year + '-' + this.stringifyMonth(month - 1)).daysInMonth();
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
      let year = this.yearNum;
      let present = this.monthKey + 1;
      let months = [];
      for (let a = 0, b = 2; a < b; a++) {
        let tmpMonth: number;
        let tmpYear: number;
        if ((present + a) > 12) {
          tmpMonth  = (present + a) - 12;
          tmpYear = year + 1;
          months.push(this.addMonthItem(tmpYear, tmpMonth));
        } else {
          tmpMonth  = present + a;
          tmpYear = year;
          months.push(this.addMonthItem(tmpYear, tmpMonth));
        }
      }
      return months;
    },

    stringifyMonth(monthKey: number): string {
      let monthString;

      if (monthKey <= 9) {
        monthString = '0' + monthKey;
      } else {
        monthString = '' + monthKey;
      }
      return monthString;
    },

    offsetStartDay(year: number, month: number) {
      return moment(year + '-' + this.stringifyMonth(month))
        .startOf('month')
        .weekday();
    },

    offsetEndDay(year: number, month: number) {
      return moment(year + '-' + this.stringifyMonth(month))
        .endOf('month')
        .weekday();
    },

    selectDateOfPeriod(d: Moment) {
      if (!moment.isMoment(this.selectedDate)) {
        this.selectedDate = d;
      } else {
        if (moment(this.selectedDate).isBefore(d)) {
          this.selectedPeriod = {
            from: this.selectedDate,
            to: d,
          };
          this.selectedDate = null;
        } else {
          this.selectedPeriod = {
            from: d,
            to: this.selectedDate,
          };
          this.selectedDate = null;
        }
      }
    },
  },
  created() {
    this.selectedPeriod.from = moment('2019-02-02');
    this.selectedPeriod.to = moment('2019-02-28');
  },
  mounted() {
    this.calendar = this.createMonths();
  },
});
</script>