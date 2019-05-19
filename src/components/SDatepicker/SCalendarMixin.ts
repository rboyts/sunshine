import Vue from 'vue';
import { DateTime } from 'luxon';

export default Vue.extend({
  data() {
    return {
      dateContext: DateTime.local().startOf('month'),
    };
  },

  computed: {
    calendar(): DateTime[] {
      return [
        this.dateContext.startOf('month'),
        this.dateContext.plus({ month: 1 }).startOf('month'),
      ];
    },
  },

  methods: {
    gotoPreviousMonth() {
      this.dateContext = this.dateContext.minus({ month: 1 });
    },

    gotoNextMonth() {
      this.dateContext = this.dateContext.plus({ month: 1 });
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
