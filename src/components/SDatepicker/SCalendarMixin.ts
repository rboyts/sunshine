import Vue from 'vue';
import { DateTime } from 'luxon';
import { IMonth } from '../types';

export default Vue.extend({
  data() {
    return {
      dateContext: DateTime.local().startOf('month'),
    };
  },

  computed: {
    calendar(): IMonth[] {
      return this.createMonths();
    },
  },

  methods: {
    gotoPreviousMonth() {
      this.dateContext = this.dateContext.minus({ month: 1 });
    },

    gotoNextMonth() {
      this.dateContext = this.dateContext.plus({ month: 1 });
    },

    createMonthItem(year: number, month: number): IMonth {
      return {
        month,
        weeksInMonth: this.createWeekNumbers(year, month),
        firstDay: this.offsetStartDay(year, month),
        lastDay: this.offsetEndDay(year, month),
        daysInMonth: DateTime.local(year, month).daysInMonth,
        previousMonthDays: this.addOverlapDays(year, month, this.offsetStartDay(year, month)),
        year,
      };
    },

    createWeekNumbers(year: number, month: number) {
      let weekNumbers = [] as number[];
      for (let c = 1, d = DateTime.local(year, month).daysInMonth; c <= d; c++) {
        let { weekNumber } = DateTime.local(year, month, c);
        if (!weekNumbers.includes(weekNumber)) {
          weekNumbers.push(weekNumber);
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
        dateToSubtractFrom = DateTime.local(lastYear, 12).daysInMonth;
      } else {
        dateToSubtractFrom = DateTime.local(year, month - 1).daysInMonth;
      }
      if (firstDay > 0) {
        // Add lastdays from previous month
        for (let c = firstDay - 1; c > 0; c--) {
          previousMonthDays.push(dateToSubtractFrom - c);
        }
      }
      return previousMonthDays;
    },

    createMonths() {
      const { year, month } = this.dateContext;
      let months = [];
      for (let a = 0; a < 2; a++) {
        let tmpMonth: number;
        let tmpYear: number;
        if ((month + a) > 12) {
          tmpMonth = (month + a) - 12;
          tmpYear = year + 1;
          months.push(this.createMonthItem(tmpYear, tmpMonth));
        } else {
          tmpMonth = month + a;
          tmpYear = year;
          months.push(this.createMonthItem(tmpYear, tmpMonth));
        }
      }

      return months;
    },

    offsetStartDay(year: number, month: number) {
      return DateTime.local(year, month).startOf('month').weekday;
    },

    offsetEndDay(year: number, month: number) {
      return DateTime.local(year, month).endOf('month').weekday;
    },

    ensureSelectionVisible(compareDate: DateTime) {
      if (!compareDate) return;

      let currentMonth = DateTime.local(this.calendar[0].year, this.calendar[0].month, 1);
      let nextMonth = DateTime.local(this.calendar[1].year, this.calendar[1].month, 1);
      if (!compareDate.hasSame(currentMonth, 'month') &&
        !compareDate.hasSame(nextMonth, 'month')) {
        this.dateContext = compareDate;
      }
    },
  },
});
