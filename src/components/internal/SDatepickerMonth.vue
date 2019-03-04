<template>
  <span class="s-datepicker__grid">
    <h3  class="s-datepicker__month">{{translateMonthName(month.month, month.year)}}</h3>
    <div class="s-datepicker__weeks">
      <span
        class="s-datepicker__weeks__week"
        v-for="(w, k) in month.weeksInMonth"
        :key="'weeksOfMonth'+month+k"
      >{{w}}</span>
    </div>
    <span
      class="s-datepicker__date--overlapping"
      v-for="(x, k) in month.previousMonthDays"
      :key="'previousDaysInMonth'+month+k"
    >{{x}}</span>
    <span
      class="s-datepicker__date"
      v-for="(a, k) in month.daysInMonth"
      :key="'daysInMonth'+month + k"
      :class="{
        'saturday': isSaturday(month.month, a, month.year),
        'sunday': isSunday(month.month, a, month.year),
        'today': isSameDate(month.month, a, month.year, today),
        'from': isSameDate(month.month, a, month.year, fromDate),
        'to': isSameDate(month.month, a, month.year, toDate),
        'between': isInPeriod(month.month, a, month.year, fromDate, toDate)
      }"
      @click="mouseClick({ y: month.year, M: month.month, d: a })"
      @mousedown="$emit('mouseDragStart', { y: month.year, M: month.month, d: a })"
      @mouseup="$emit('mouseDragEnd', { y: month.year, M: month.month, d: a })"
      @mouseover="mouseOverEvent({ y: month.year, M: month.month, d: a })"
    >
      <span v-if="isSameDate(month.month, a, month.year, fromDate)" class="circle">{{a}}</span>
      <span v-else-if="isSameDate(month.month, a, month.year, toDate)" class="circle">{{a}}</span>
      <span v-else-if="isSameDate(month.month, a, month.year, selectedDate)" class="circle">
        {{a}}
      </span>
      <span v-else>{{a}}</span>
    </span>
    <span
      class="s-datepicker__date--overlapping"
      v-for="(x, k) in (6 - month.lastDay)"
      :key="'lastDaysOfMonth'+month+k"
    >{{x}}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod, IMomentPayload } from '../types';

/**
 * Obs: for comparison of dates this uses default date format (ISO 8601) 'YYYY-MM-DD'
 */

export default Vue.extend({
  name: 's-datepicker-month',

  props: {
    format: String,
    locale: String,
    range: Boolean,
    month: Object as () => IMonth,
    today: Object as () => Moment,
    lastScrollPosition: Number,
    scrollHeight: Number,
    mouseDrag: Boolean,
    selectedDate: {} as () => Moment,
    selectedPeriod: {} as () => ICalendarPeriod,
  },

  computed: {
    fromDate(): Moment {
      return this.selectedPeriod.from;
    },

    toDate(): Moment {
      return this.selectedPeriod.to;
    },
  },

  methods: {
    translateMonthName(monthKey: number, year: number) {
      return moment({ y: year, M: (monthKey - 1) }).format('MMMM-YYYY');
    },

    dayOfWeek(m: number, d: number, y: number) {
      return moment({ y, M: (m - 1), d }).day();
    },

    isSaturday(m: number, d: number, y: number) {
      return moment({ y, M: (m - 1), d }).day() === 6;
    },

    isSunday(m: number, d: number, y: number) {
      return moment({ y, M: (m - 1), d }).day() === 0;
    },

    isSameDate(m: number, d: number, y: number, date: string) {
      let dateInMonth = moment({ y, M: (m - 1), d }).format('YYYY-MM-DD');
      let compareDate = moment(date).format('YYYY-MM-DD');
      return moment(dateInMonth).isSame(compareDate);
    },

    isInPeriod(m: number, d: number, y: number, fromDate: string, toDate: string): boolean {
      let dateInMonth = moment({ y, M: (m - 1), d }).format('YYYY-MM-DD');
      let compareDateFrom = moment(fromDate).format('YYYY-MM-DD');
      let compareDateTo = moment(toDate).format('YYYY-MM-DD');
      return moment(dateInMonth).isBetween(compareDateFrom, compareDateTo);
    },

    mouseOverEvent(payload: IMomentPayload) {
      if (!this.mouseDrag) return;
      this.$emit('mouseDragging', payload);
    },

    mouseClick(payload: IMomentPayload) {
      if (this.range) return;
      this.$emit('mouseClick', payload);
    },
  },
});
</script>
