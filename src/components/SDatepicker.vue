<template>
  <div class="s-datepicker">
    <s-datepicker-calendar 
      :today="today.format('YYYY-MM-DD')"
      :calendar="calendar"
      :current-year="yearNum"
      :current-month="monthKey + 1"
      :selected-period="selectedPeriod"
      @click="dateClicked"
      @addMonth="addMonth"
    />
    <s-datepicker-menu />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth } from './types';
import SDatepickerCalendar from './internal/SDatepickerCalendar.vue';
import SDatepickerMenu from './internal/SDatepickerMenu.vue';

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

    addMonth() {
      this.dateContext = moment(this.dateContext).add(1, 'M');
      this.calendar = this.createMonths();
      console.log(this.dateContext.format('YYYY-MM-DD'));
    },

    addMonthItem(year: number, month: number): IMonth {
      return {
        month,
        weeksInMonth: this.addWeekNumbers(year, month),
        firstDay: this.offsetStartDay(year, month),
        lastDay: this.offsetEndDay(year, month),
        daysInMonth: moment(year + '-' + month).daysInMonth(),
        previousMonthDays: this.addOverlapDays(year, month, this.offsetEndDay(year, month)),
        year,
      };
    },

    addWeekNumbers(year: number, month: number) {
      let weekNumbers = [] as number[];
      for (let c = 0, d = (moment(year + '-' + month).daysInMonth() - 1); c <= d; c++) {
        let week = moment(year + '-' + this.stringifyMonth(month) + '-' + (c + 1 )).week();
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
      const year = this.yearNum;
      const present = this.monthKey + 1;
      let past = [];
      let future = [];
      for (let a = 0, b = 12; a < b; a++) {
        let tmpMonth: number;
        let tmpYear: number;
        // Add coming months including current
        if ((present + a) > 12) {
          tmpMonth  = (present + a) - 12;
          tmpYear = year + 1;
          future.push(this.addMonthItem(tmpYear, tmpMonth));
        } else {
          tmpMonth  = present + a;
          tmpYear = year;
          future.push(this.addMonthItem(tmpYear, tmpMonth));
        }

        // Add past months, skipping current
        if ((present - a) <= 0 && (present - a) !== present) {
          tmpMonth = (present - a) + 12;
          tmpYear = year - 1;
          past.push(this.addMonthItem(tmpYear, tmpMonth));
        } else if ((present - a) !== present) {
          tmpMonth = present - a;
          tmpYear = year;
          past.push(this.addMonthItem(tmpYear, tmpMonth));
        }
      }
      past = past.reverse();
      future.map(item => {
        past.push(item);
      });
      return past;
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
      return moment(year + '-' + this.stringifyMonth(month) + '-01')
        .startOf('month')
        .weekday();
    },

    offsetEndDay(year: number, month: number) {
      return moment(year + '-' + this.stringifyMonth(month) + '-01')
        .endOf('month')
        .weekday();
    },

    dateClicked(d: Moment) {
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
    this.selectedPeriod.from = moment('02-02-2019');
    this.selectedPeriod.to = moment('02-28-2019');
  },
  mounted() {
    this.calendar = this.createMonths();
  },
});
</script>