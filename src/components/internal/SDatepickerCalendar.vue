<template>
  <div class="s-datepicker__scrollcontainer" ref="scrollcontainer" @scroll="debounceOnScroll">
      <div class="s-datepicker__header">
        <div class="flex flex-even s-datepicker__navigation">
            <h4>{{translateMonthName(activeMonth, activeYear)}}</h4>
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
          <h3  class="s-datepicker__month">{{translateMonthName(month.month, month.year)}}</h3>
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
import debounce from 'debounce';
import { IMonth, ICalendarPeriod } from '../types';
import moment, { Moment } from 'moment';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 350;

moment.locale('nb');

export default Vue.extend({
  name: 's-datepicker-calendar',
  data() {
    return {
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
      dateContext: moment(),
      activeMonth: this.currentMonth,
      activeYear: this.currentYear,
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
    // TODO: Create interface
    scrollPositionOfMonths(): any {
      return this.yPositionsOfMonths();
    },
  },
  methods: {

    // Placeholder for type safety
    debounceOnScroll(event: UIEvent) { /* empty */ },

    stringifyMonth(monthKey: number): string {
      let monthString;

      if (monthKey <= 9) {
        monthString = '0' + monthKey;
      } else {
        monthString = '' + monthKey;
      }
      return monthString;
    },

    translateMonthName(monthKey: number, year: number) {
      return moment(year + '-' + monthKey).format('MMMM-YYYY');
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
      if (scrollX === 0) {
        this.scrollContainer.scrollTop = 90;
      }
      this.loadAdditionalMonths(scrollX);

      this.$nextTick(() => {
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
          let tmp = this.scrollPositionOfMonths[position[position.length - 1]].split('-');
          this.activeMonth = tmp[0] as number;
          this.activeYear = tmp[1] as number;
        }
      });
    },

    loadAdditionalMonths(x: number) {
      if (x <= (this.scrollContainer.scrollHeight / 4)) {
        this.$emit('subtractMonth');
      } else if (x >= (this.scrollContainer.scrollHeight - (this.scrollContainer.scrollHeight / 4))) {
        this.$emit('addMonth');
      }
    },

    scrollToCurrentMonth() {
      this.$nextTick(() => {
        const currentMonthAndYear = String(this.currentMonth) + '-' + String(this.currentYear);
        for (let value in this.scrollPositionOfMonths) {
          if (this.scrollPositionOfMonths[value] === currentMonthAndYear) {
            this.scrollContainer.scrollTop = Number(value);
          }
        }
      });
    },
  },
  created() {
    this.debounceOnScroll = debounce(this.onCalendarScroll, SCROLL_DEBOUNCE);
    this.$nextTick(() => {
      this.scrollToCurrentMonth();
    });
  },
});
</script>