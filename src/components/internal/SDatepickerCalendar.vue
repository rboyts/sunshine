<template>
  <div class="s-datepicker__scrollcontainer" ref="scrollcontainer" @scroll="onCalendarScroll">
      <div class="s-datepicker__header">
        <div class="flex flex-even s-datepicker__navigation">
            <h4>{{activeMonth}}</h4>
        </div>
        <ul class="s-datepicker__days">
          <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
        </ul>
      </div>
      <div class="s-datepicker__grid__container">
        <span
          class="s-datepicker__grid"
          v-for="(month, monthKey) in calendar"
          :ref="month.month + '-' + month.year"
          :id="'month' + month.month + '-' + month.year"
          :key="'month' + month.month + '-' + month.year"
        >
          <h3  class="s-datepicker__month">{{translateMonthName(month.month)}} - {{month.year}}</h3>
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
            :id="month.month + '-' + a + '-' + month.year"
            @click="selectDate(month.month, a, month.year)"
            :class="{
              'today': isSameDate(month.month, a, month.year, today),
              'from': isSameDate(month.month, a, month.year, fromDate), 
              'to': isSameDate(month.month, a, month.year, toDate),
              'between': isInPeriod(month.month, a, month.year, fromDate, toDate)
              }"
          >
            <span v-if="isSameDate(month.month, a, month.year, fromDate)" class="circle">{{a}}</span>
            <span v-else-if="isSameDate(month.month, a, month.year, toDate)" class="circle">{{a}}</span>
            <span v-else>{{a}}</span>
          </span>
          <span
            class="s-datepicker__date--overlapping"
            v-for="x in (6 - month.lastDay)"
          >{{x}}</span>
        </span>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IMonth, ICalendarPeriod } from '../types';
import moment, { Moment } from 'moment';

export default Vue.extend({
  name: 's-datepicker-calendar',
  data() {
    return {
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
      dateContext: moment(),
      activeMonth: '',
      monthYOffset: -190,
    };
  },
  props: {
    calendar: Array as () => IMonth[],
    selectedPeriod: Object as () => ICalendarPeriod,
    today: String,
    currentMonth: Number,
    currentYear: Number,
  },
  computed: {
    toDate(): string {
      return moment(this.selectedPeriod.to).format('YYYY-MM-DD');
    },

    fromDate(): string {
      return moment(this.selectedPeriod.from).format('YYYY-MM-DD');
    },

    scrollContainer(): HTMLElement {
      return this.$refs.scrollcontainer as HTMLElement;
    },

    initialMonth(): string {
      return this.currentMonth + '-' + this.currentYear;
    },
    // Create interface
    scrollPositionOfMonths(): any {
      return this.yPositionsOfMonths();
    },
  },
  methods: {
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
      return moment('2019-' + monthKey).format('MMMM');
    },

    isSameDate(m: number, d: number, y: number, date: string) {
      return moment(y + '-' + m + '-' + d).isSame(date);
    },

    isInPeriod(m: number, d: number, y: number, fromDate: string, toDate: string) {
      return moment(y + '-' + m + '-' + d).isBetween(fromDate, toDate);
    },

    selectDate(m: number, d: number, y: number) {
      let date = moment(y + '-' + m + '-' + d);
      this.$emit('click', date);
    },

    yPositionsOfMonths() {
      let elements = {} as any;
      for (let a = 0, b = this.calendar.length; a < b; a++) {
        let el = this.$refs[this.calendar[a].month + '-' + this.calendar[a].year] as HTMLElement[];
        elements[el[0].offsetTop] = this.calendar[a].month + '-' + this.calendar[a].year;
      }
      return elements;
    },

    onCalendarScroll() {
      let scrollX = this.scrollContainer.scrollTop;

      this.shouldLoadAdditionalMonths(scrollX);

      let position = Object.keys(this.scrollPositionOfMonths).filter((a, b) => {
        if (scrollX >= Number(a) + (this.monthYOffset / 2)) {
          return 1;
        } else {
          return 0;
        }
        return -1;
      });

      if (
        this.activeMonth !==
        this.scrollPositionOfMonths[position[position.length - 1]]
      ) {
        this.activeMonth = this.scrollPositionOfMonths[position[position.length - 1]];
      }
    },

    shouldLoadAdditionalMonths(x: number) {
      if (x <= (this.scrollContainer.scrollHeight / 4)) {
        console.log('Load past months');
        console.log((this.scrollContainer.scrollHeight / 4));
      } else if (x >= (this.scrollContainer.scrollHeight - (this.scrollContainer.scrollHeight / 4))) {
        console.log('Load future months');
        console.log((this.scrollContainer.scrollHeight - (this.scrollContainer.scrollHeight / 4)));
      }
    },

    scrollToCurrentMonth() {
      for (let a in this.scrollPositionOfMonths) {
        if (this.scrollPositionOfMonths[a] === this.initialMonth) {
          this.scrollContainer.scrollTop = Number(a);
        }
      }
    },
  },

  updated() {
    this.scrollToCurrentMonth();
  },
});
</script>