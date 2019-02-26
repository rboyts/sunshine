<template>
  <div class="s-datepicker__calendar">
    <div class="s-datepicker__header">
      <div class="flex flex-even s-datepicker__navigation">
          <span class="s-datepicker__navigation-arrow back" @click="$emit('addPreviousMonth')" >
            <s-icon package="sunshine24" name="arrow" />
          </span>
          <h2>{{monthNameInHeader}}</h2>
          <span class="s-datepicker__navigation-arrow forward" @click="$emit('addComingMonth')" >
            <s-icon package="sunshine24" name="arrow" />
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
            v-for="month in calendar"
            :format="format"
            :locale="locale"
            :today="today"
            :ref="month.month + '-' + month.year"
            :key="'month' + month.month + '-' + month.year"
            :month="month"
            :mouseDrag="mouseDrag"
            :selectedDate="selectedDate"
            :selectedPeriod="selectedPeriod"
            @mouseDragEvent="mouseDragEvent"
          >
        </s-datepicker-month>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'debounce';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod, MouseWheelEvent } from '../types';
import SIcon from '../SIcon.vue';
import SDatepickerMonth from './SDatepickerMonth.vue';

export default Vue.extend({
  name: 's-datepicker-calendar',
  components: {
    SDatepickerMonth,
    SIcon,
  },
  data() {
    return {
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
    today: Object as () => Moment,
    currentMonth: Number,
    currentYear: Number,
    mouseDrag: Boolean,
    format: String,
    locale: String,
    range: Boolean,
    selectedDate: Object as () => Moment,
    selectedPeriod: Object as () => ICalendarPeriod,
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
      let date = moment({ y, M: (m - 1), d });
      if (this.range) {
        this.$emit('mouseDragEvent', date, event);
      } else {
        this.$emit('mouseClickEvent', date, event);
      }
    },

    setActiveMonth(calendar: IMonth[]) {
      this.monthNameInHeader = moment({
        y: calendar[0].year,
        M: calendar[0].month,
      }).format('MMMM YYYY');
    },

    calendarScroll(event: MouseWheelEvent) {
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
