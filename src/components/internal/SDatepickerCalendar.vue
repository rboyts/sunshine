<template>
  <div>
    <div class="s-datepicker__header">
      <div class="flex flex-even s-datepicker__navigation">
          <h4>{{translateMonthName(activeMonth, activeYear)}}</h4>
      </div>
      <ul class="s-datepicker__days">
        <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
      </ul>
    </div>
    <div class="s-datepicker__grid__container">
      <virtual-list 
        :size="193" 
        :remain="2"
        :bench="bench"
        :onscroll="onScroll"
        :debounce="debounce"
        ref="virtualList"
      >    
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
      </virtual-list>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, {Component} from 'vue';
import debounce from 'debounce';
import { IMonth, ICalendarPeriod } from '../types';
import moment, { Moment } from 'moment';
import virtualList from 'vue-virtual-scroll-list';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 350;

moment.locale('nb');

export default Vue.extend({
  name: 's-datepicker-calendar',
  components: {'virtual-list': virtualList },
  data() {
    return {
      bench: 6,
      debounce: 350,
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
      dateContext: moment(),
      activeMonth: this.currentMonth,
      activeYear: this.currentYear,
      monthYOffset: 192,
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

    scrollOffset(): number {
      let element = this.$refs.virtualList as any;
      element = element.$el as HTMLElement;
      return element.scrollTop;
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

/*
    toBottom() {
      this.$emit('addMonth');
    },

    toTop() {
      this.$emit('subtractMonth');
    },
*/
    onScroll(event: any, data: any) {
      let element = this.$refs.virtualList as any;
      element = element.$el as HTMLElement;
      let direction: string;
      if (element.scrollTop > this.scrollOffset) {
        direction = 'down';
      } else if (element.scrollTop < this.scrollOffset) {
        direction = 'up';
      } else {
        direction = 'same';
      }

      if (element.scrollTop <= 0) {
        element.scrollTop = 10;
      }
      if (data.offset <= (data.offsetAll / 4) && direction === 'up') {
        this.$emit('addPreviousMonth');
      } else if (data.offset >= (data.offsetAll - (data.offsetAll / 4)) && direction === 'down') {
        this.$emit('addComingMonth');
      }
    },
  },

  mounted() {
    console.log(this.$refs.virtualList);
  },
});
</script> 