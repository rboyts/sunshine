<template>
    <div class="s-datepicker__calendar">
      <div class="s-datepicker__header">
        <div class="flex flex-even s-datepicker__navigation">
            <h4>{{monthNameInHeader}}</h4>
        </div>
        <ul class="s-datepicker__days">
          <li class="s-datepicker__day" v-for="(day, i) in days" :key="'Day' + i">{{day}}</li>
        </ul>
      </div>
      <div class="s-datepicker__grid__container"
        style="height: 390px; overflow: hidden;" v-wheel="testScroller">
        <div class="s-datepicker__scroller" ref="calendarList">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'debounce';
import { IMonth, ICalendarPeriod } from '../types';
import moment, { Moment } from 'moment';
import vuewheel from 'vuewheel';
import SDatepickerMonth from './SDatepickerMonth.vue';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 350;
const PADDING_TOP = 30;

moment.locale('nb');

Vue.use(vuewheel);

export default Vue.extend({
  name: 's-datepicker-calendar',
  components: {SDatepickerMonth },
  data() {
    return {
      bench: 24,
      debounce: SCROLL_DEBOUNCE,
      days: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
      dateContext: moment(),
      activeMonth: this.currentMonth,
      activeYear: this.currentYear,
      lastScrollPosition: 0,
      scrollHeight: 0,
      monthNameInHeader: '',
    };
  },
  props: {
    calendar: Array as () => IMonth[],
    selectedPeriod: Object as () => ICalendarPeriod,
    today: String,
    currentMonth: Number,
    currentYear: Number,
  },
  watch: {
    calendar: {
      handler(newVal: IMonth[], oldVal: IMonth[]) {
        this.setActiveMonth(newVal);
      },
    },
  },
  methods: {
    setActiveMonth(calendar) {
      this.monthNameInHeader = moment(calendar[0].year + '-' + this.stringifyMonth(calendar[0].month)).format('MMMM-YYYY');
    },

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

    testScroller(event: UIEvent) {
      let dragDirection = (event.wheelDelta > 0)? 'down' : 'up';
      if (dragDirection === 'down') {
        this.$emit('addPreviousMonth')
      } else if (dragDirection === 'up') {
        this.$emit('addComingMonth')
      }
    },

  },
});
</script> 