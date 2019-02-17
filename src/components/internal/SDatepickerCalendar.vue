<template>
    <div class="s-datepicker__calendar">
      <div class="s-datepicker__header">
        <div class="flex flex-even s-datepicker__navigation">
            <span class="s-datepicker__navigation-arrow back" @click="$emit('addPreviousMonth')" >
              <s-svg name="arrow" />
            </span>
            <h4>{{monthNameInHeader}}</h4>
            <span class="s-datepicker__navigation-arrow forward" @click="$emit('addComingMonth')" >
              <s-svg name="arrow" />
            </span>
        </div>
        <ul class="s-datepicker__days">
          <li
            class="s-datepicker__day"
            v-for="(day, i) in days"
            :key="'Day' + i"
            :class="{
              'saturday': (i === 5),
              'sunday': (i === 6),
            }"
          >{{day}}</li>
        </ul>
      </div>
      <div class="s-datepicker__grid__container"
        style="height: 390px; overflow: hidden;" v-on:wheel="calendarScroll">
        <div class="s-datepicker__scroller" ref="calendarList">
          <s-datepicker-month
              class="s-datepicker__grid"
              v-for="(month, monthKey) in calendar"
              :today="today"
              :selected-period="selectedPeriod"
              :ref="month.month + '-' + month.year"
              :key="'month' + month.month + '-' + month.year"
              :month="month"
              :mouseDrag="mouseDrag"
              @mouseDragEvent="mouseDragEvent"
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
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod, MouseWheelEvent } from '../types';
import SSvg from './SSvg.vue';
import SDatepickerMonth from './SDatepickerMonth.vue';

const SCROLL_DEBOUNCE = 250;
const MOVE_TIMEOUT = 350;
const PADDING_TOP = 30;

moment.locale('nb');

export default Vue.extend({
  name: 's-datepicker-calendar',
  components: {
    SDatepickerMonth,
    SSvg,
  },
  data() {
    return {
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
    mouseDrag: Boolean,
  },
  watch: {
    calendar: {
      handler(newVal: IMonth[], oldVal: IMonth[]) {
        this.setActiveMonth(newVal);
      },
    },
  },
  methods: {
    mouseDragEvent(m: number, d: number, y: number, event: string) {
      let date = moment(`${y}-${this.stringifySingleDigit(m)}-${this.stringifySingleDigit(d)}`);
      this.$emit('mouseDragEvent', date, event);
    },

    setActiveMonth(calendar: IMonth[]) {
      this.monthNameInHeader = moment(`${calendar[0].year
      }-${this.stringifySingleDigit(calendar[0].month)}`).format('MMMM-YYYY');
    },

    stringifySingleDigit(key: number): string {
      let digitAsString;

      if (key <= 9) {
        digitAsString = `0${key}`;
      } else {
        digitAsString = `${key}`;
      }
      return digitAsString;
    },

    calendarScroll(event: MouseWheelEvent) {
      // TODO: adjust event.wheelDelta minimum scroll to compensate for trackpads which are really sensitive?
      let dragDirection = (event.wheelDelta > 0) ? 'down' : 'up';
      if (dragDirection === 'down') {
        this.$emit('addPreviousMonth');
      } else if (dragDirection === 'up') {
        this.$emit('addComingMonth');
      }
    },

  },
});
</script>
