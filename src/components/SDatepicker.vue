<template>
  <div class="s-datepicker" style="margin: 0 auto;">

    <div class="s-datepicker__header">
      <div class="flex flex-even s-datepicker__navigation">
        <i class="fa fa-fw fa-chevron-left" @click="subtractMonth"></i>
        <h4>{{month + ' - ' + year}}</h4>
        <i class="fa fa-fw fa-chevron-right" @click="addMonth"></i>
      </div>
      <ul class="s-datepicker__days">
        <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
      </ul>
    </div>
  
    <div id="scrollContainer" @scroll="onCalendarScroll" class="s-datepicker__scrollcontainer">
      <div class="s-datepicker__grid__container">
        <span
          class="s-datepicker__grid"
          v-for="(month, monthKey) in calendar"
          :ref="stringifyMonth(month.month) + '-' + month.monthYear"
          :id="'month' + stringifyMonth(month.month) + '-' + month.monthYear"
          @click="selectDate"
        >
          <h3  class="s-datepicker__month">{{translateMonthName(month.month)}} - {{month.monthYear}}</h3>
          <div class="s-datepicker__weeks">
            <span
              class="s-datepicker__weeks__week"
              v-for="w in month.weeksInMonth"
            >{{w}}</span>
          </div>
          <span
            class="s-datepicker__date--overlapping"
            v-for="x in month.previousMonthDays"
          >{{x}}</span>
          <span
            class="s-datepicker__date"
            v-for="a in month.daysInMonth"
            :class="{'s-datepicker__date--active': activeDate(a + '-' + month.month + '-' + month.monthYear)}"
            :id="month.month + '-' + a + '-' + month.monthYear"
          >{{a}}</span>
          <span
            class="s-datepicker__date--overlapping"
            v-for="x in (6 - month.lastDay)"
          >{{x}}</span>
        </span>
      </div>
    </div>
    
    <div class="s-datepicker__menu">
      <p>active date</p>
      <span>{{this.dateContext.format('DD-MM-YYYY')}}</span>
      <p>select week</p>
      <p>select month</p>
      <p>select year</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import { IMonth } from './types';
const VueScrollTo = require('vue-scrollto');

moment.locale('nb');

Vue.use(VueScrollTo, {
  test: 'foo',
  container: '#scrollContainer',
  duration: 200,
  easing: 'ease',
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true,
});

export default Vue.extend({
  name: 's-datepicker',

  data() {
    return {
      today: moment(),
      dateContext: moment(),
      weekNumbers: moment().weeksInYear(),
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
      vueScrollTo: VueScrollTo,
      monthXPositions: {} as any,
      monthOffset: -90,
      dateClass: 's-datepicker__date',
    };
  },

  mounted() {
    // Save the offsetTop position of months for scrollcontainer
    this.xPositionsOfMonths();
    this.vueScrollTo.scrollTo('#month' + this.dateContext.format('MM-YYYY'), {offset: this.monthOffset});
  },

  computed: {

    calendar(): IMonth[] {
      return this.getMonthsInYear(Number(this.year));
    },

    scrollContainer(): HTMLElement {
      return this.$el.querySelector('#scrollContainer') as HTMLElement;
    },

    year(): string {
      return this.dateContext.format('Y');
    },

    month(): string {
      return this.dateContext.format('MMMM');
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

    activeDate(date: string): boolean {
      return this.dateContext.format('D-M-YYYY') == date;
    },

    selectDate(e: any) {
      if (!e.target.classList.contains(this.dateClass)) {
        return false;
      }
      let date = moment(e.target.id)
      this.dateContext = date;
    },

    xPositionsOfMonths() {
      // Should be recalculated when year changes
      for (let a = 0, b = this.months.length; a < b; a++) {
        let element = this.$refs[
          this.stringifyMonth(this.months[a]) + '-' + this.year
        ] as HTMLElement[];
        this.monthXPositions[element[0].offsetTop] =
          this.stringifyMonth(this.months[a]) + '-01-' + this.year;
      }
    },

    subtractMonth() {
      this.vueScrollTo.scrollTo(
        '#month' +
        moment(this.dateContext)
          .subtract(1, 'M')
          .format('MM-YYYY'),
        { offset: this.monthOffset },
      );
    },

    addMonth() {
      this.vueScrollTo.scrollTo(
        '#month' +
        moment(this.dateContext)
          .add(1, 'M')
          .format('MM-YYYY'),
        { offset: this.monthOffset },
      );
    },

    onCalendarScroll() {
      let array = Object.keys(this.monthXPositions);
      let scrollX = this.scrollContainer.scrollTop;

      // TODO: Write a more accurate filter to find current month
      let position = array.find(element => {
        return scrollX >= Number(element) && scrollX <= Number(element) + 192;
      });
      if (
        this.dateContext.format('MM-YYYY') !==
        this.monthXPositions[String(position)]
      ) {
        this.dateContext = moment(this.monthXPositions[String(position)]);
      }
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

    translateMonthName(monthKey: number) {
      return moment('2019-' + this.stringifyMonth(monthKey)).format('MMMM');
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

    getMonthsInYear(year: number): IMonth[] {
      let months: IMonth[] = [];
      for (let a = 0, b = this.months.length; a < b; a++) {
        months.push({
          month: this.months[a],
          weeksInMonth: [],
          firstDay: this.offsetStartDay(year, this.months[a]),
          lastDay: this.offsetEndDay(year, this.months[a]),
          daysInMonth: moment(
            year + '-' + this.stringifyMonth(this.months[a]),
          ).daysInMonth(),
          previousMonthDays: [],
          monthYear: year,
        });
      }
      this.addOverlapDays(months);
      this.addWeekNumbers(months, year);
      return months;
    },

    addOverlapDays(months: IMonth[]): IMonth[] {
      for (let a = 0, b = months.length; a < b; a++) {
        let dateToSubtractFrom: number;
        if (a === 0) {
          // If january, get last day from previous years last month
          let lastYear = parseInt(this.year, 1) - 1;
          dateToSubtractFrom = moment(lastYear + '-12').daysInMonth();
        } else {
          dateToSubtractFrom = months[a - 1].daysInMonth;
        }
        if (months[a].firstDay > 0) {
          // Add lastdays from previous month
          for (let c = months[a].firstDay - 1, d = 0; c >= d; c--) {
            months[a].previousMonthDays.push(dateToSubtractFrom - c);
          }
        }
      }

      return months;
    },

    addWeekNumbers(months: IMonth[], year: number) {
      for (let a = 0, b = months.length; a < b; a++) {
        for (let c = 1, d = months[a].daysInMonth; c <= d; c++) {
          let week = moment(year + '-' + (a + 1) + '-' + c).week();
          if (!months[a].weeksInMonth.includes(week)) {
            months[a].weeksInMonth.push(week);
          }
        }
      }
    },
  },
});
</script>
