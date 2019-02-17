<template>
  <span class="s-datepicker__grid">
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
      @mousedown="$emit('mouseDragEvent', month.month, a, month.year, 'dragStart')"
      @mouseup="$emit('mouseDragEvent', month.month, a, month.year, 'dragEnd')"
      @mouseover="mouseOverEvent(month.month, a, month.year)"
      :class="{
        'saturday': isSaturday(month.month, a, month.year),
        'sunday': isSunday(month.month, a, month.year),
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
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod } from '../types';

moment.locale('nb');

export default Vue.extend({
  name: 's-datepicker-month',
  props: {
    month: Object as () => IMonth,
    selectedPeriod: Object as () => ICalendarPeriod,
    today: String,
    lastScrollPosition: Number,
    scrollHeight: Number,
    mouseDrag: Boolean,
  },
  computed: {
    toDate(): string {
      // Format used to compare dates, so not formatted for localization
      return moment(this.selectedPeriod.to).format('YYYY-MM-DD');
    },

    fromDate(): string {
      // Format used to compare dates, so not formatted for localization
      return moment(this.selectedPeriod.from).format('YYYY-MM-DD');
    },
  },
  methods: {
    stringifySingleDigit(key: number): string {
      let digitAsString;

      if (key <= 9) {
        digitAsString = `0${key}`;
      } else {
        digitAsString = `${key}`;
      }
      return digitAsString;
    },

    translateMonthName(monthKey: number, year: number) {
      // TODO: Translate to other types of locales?
      return moment(`${year}-${this.stringifySingleDigit(monthKey)}`).format('MMMM-YYYY');
    },

    isSaturday(m: number, d: number, y: number) {
      return moment(`${y}-${this.stringifySingleDigit(m)}-${this.stringifySingleDigit(d)}`).day() === 6;
    },

    isSunday(m: number, d: number, y: number) {
      return moment(`${y}-${this.stringifySingleDigit(m)}-${this.stringifySingleDigit(d)}`).day() === 0;
    },

    isSameDate(m: number, d: number, y: number, date: string) {
      return moment(`${y}-${this.stringifySingleDigit(m)}-${this.stringifySingleDigit(d)}`).isSame(date);
    },

    isInPeriod(m: number, d: number, y: number, fromDate: string, toDate: string) {
      return moment(`${y}-${this.stringifySingleDigit(m)}-${this.stringifySingleDigit(d)}`).isBetween(fromDate, toDate);
    },

    mouseOverEvent(m: number, d: number, y: number) {
      if (!this.mouseDrag) {
        return false;
      }
      this.$emit('mouseDragEvent', m, d, y, 'dragging');
    },
  },
});
</script>
