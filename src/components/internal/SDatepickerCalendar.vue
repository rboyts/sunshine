<template>
  <div class="s-datepicker__calendar">
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
        class="s-datepicker__virtuallist"
        :size="193" 
        :remain="2"
        :bench="bench"
        :onscroll="onScroll"
        :debounce="debounce"
        ref="virtualList"
      >    
        <s-datepicker-month
          class="s-datepicker__grid"
          v-for="(month, monthKey) in calendar"
          @click="selectDate"
          :today="today"
          :selected-period="selectedPeriod"
          :ref="month.month + '-' + month.year"
          :key="'month' + month.month + '-' + month.year"
          :month="month"
        >
        </s-datepicker-month>
      </virtual-list>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'debounce';
import { IMonth, ICalendarPeriod } from '../types';
import moment, { Moment } from 'moment';
import virtualList from 'vue-virtual-scroll-list';
import SDatepickerMonth from './SDatepickerMonth.vue';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 350;
const PADDING_TOP = 60;

moment.locale('nb');

export default Vue.extend({
  name: 's-datepicker-calendar',
  components: {'virtual-list': virtualList, SDatepickerMonth },
  data() {
    return {
      bench: 6,
      debounce: SCROLL_DEBOUNCE,
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
      dateContext: moment(),
      activeMonth: this.currentMonth,
      activeYear: this.currentYear,
      lastScrollPosition: 0,
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
    initialMonth(): string {
      return this.currentMonth + '-' + this.currentYear;
    },

    scrollElement(): HTMLElement {
      let element = this.$refs.virtualList as any;
      element = element.$el as HTMLElement;
      return element;
    },

    currentMonthElement(): HTMLElement {
      return this.$refs[this.currentMonth + '-' + this.currentYear] as HTMLElement;
    },
  },
  methods: {
    selectDate(m: number, d: number, y: number) {
      let date = moment(y + '-' + m + '-' + d);
      this.$emit('click', date);
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

    translateMonthName(monthKey: number, year: number) {
      return moment(year + '-' + monthKey).format('MMMM-YYYY');
    },

    onScroll(event: any, data: any) {
      let direction: string;
      if (this.scrollElement.scrollTop > this.lastScrollPosition) {
        direction = 'down';
        this.lastScrollPosition = this.scrollElement.scrollTop;
      } else if (this.scrollElement.scrollTop < this.lastScrollPosition) {
        direction = 'up';
        this.lastScrollPosition = this.scrollElement.scrollTop;
      } else {
        direction = 'same';
      }
      if (this.scrollElement.scrollTop <= 0) {
        this.scrollElement.scrollTop = PADDING_TOP;
      }
      if (data.offset <= (data.offsetAll / 4) && direction === 'up') {
        this.$emit('addPreviousMonth');
      } else if (data.offset >= (data.offsetAll - (data.offsetAll / 4)) && direction === 'down') {
        this.$emit('addComingMonth');
      }
    },

    setupVirtualScrollPosition() {
      this.scrollElement.style.paddingTop = PADDING_TOP + 'px';
      console.log(this.scrollElement);
      console.log(this.$refs['1-2019']);
      if (this.currentMonthElement !== undefined) {
        this.scrollElement.scrollTop = this.currentMonthElement[0].offsetTop;
      } else {
        this.scrollElement.scrollTop = PADDING_TOP;
      }
    },
  },
  async mounted() {
    await Vue.nextTick().then(() => this.setupVirtualScrollPosition());
  },
});
</script> 