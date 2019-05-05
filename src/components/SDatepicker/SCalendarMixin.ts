import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth } from '../types';

export default Vue.extend({
  data() {
    return {
      dateContext: moment().startOf('month'),
    };
  },

  computed: {
    calendar(): IMonth[] {
      return this.createMonths();
    },
  },

  methods: {
    gotoPreviousMonth() {
      this.dateContext = moment(this.dateContext).subtract(1, 'month');
    },

    gotoNextMonth() {
      this.dateContext = moment(this.dateContext).add(1, 'month');
    },

    createMonthItem(year: number, month: number): IMonth {
      return {
        month,
        weeksInMonth: this.createWeekNumbers(year, month),
        firstDay: this.offsetStartDay(year, month),
        lastDay: this.offsetEndDay(year, month),
        daysInMonth: moment([year, (month - 1)]).daysInMonth(),
        previousMonthDays: this.addOverlapDays(year, month, this.offsetStartDay(year, month)),
        year,
      };
    },

    createWeekNumbers(year: number, month: number) {
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
      let year = this.dateContext.get('year');
      let present = this.dateContext.get('month') + 1;
      let months = [];
      for (let a = 0; a < 2; a++) {
        let tmpMonth: number;
        let tmpYear: number;
        if ((present + a) > 12) {
          tmpMonth = (present + a) - 12;
          tmpYear = year + 1;
          months.push(this.createMonthItem(tmpYear, tmpMonth));
        } else {
          tmpMonth = present + a;
          tmpYear = year;
          months.push(this.createMonthItem(tmpYear, tmpMonth));
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

    ensureSelectionVisible(compareDate: Moment) {
      if (!compareDate) return;

      let currentMonth = moment([this.calendar[0].year, (this.calendar[0].month - 1), 1]);
      let nextMonth = moment([this.calendar[1].year, (this.calendar[1].month - 1), 1]);
      if (!moment(compareDate).isSame(currentMonth, 'month') &&
        !moment(compareDate).isSame(nextMonth, 'month')) {
        this.dateContext = moment(compareDate);
      }
    },
  },
});
