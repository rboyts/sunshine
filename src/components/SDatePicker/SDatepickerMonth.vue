<template>
  <span class="s-datepicker__grid">
    <h3  class="s-datepicker__month">{{translateMonthName(month.month, month.year)}}</h3>
    <div class="s-datepicker__weeks">
      <span
        class="s-datepicker__weeks__week"
        v-for="w in month.weeksInMonth"
        :key="w"
        :data-key="w"
      >{{w}}</span>
    </div>
    <span
      class="s-datepicker__date--overlapping"
      v-for="(x, k) in month.previousMonthDays"
      :key="`${x}-${month.month}-${k}`"
    >{{x}}</span>
    <span
      class="s-datepicker__date"
      v-for="a in month.daysInMonth"
      :key="`${a}-${month.month}`"
      :class="setDateClasses(month.month, a, month.year)"
      @click="mouseClick({ y: month.year, M: month.month, d: a })"
      @mousedown="$emit('mouse-drag-start', { y: month.year, M: month.month, d: a })"
      @mouseup="$emit('mouse-drag-end', { y: month.year, M: month.month, d: a })"
      @mouseover="mouseOverEvent({ y: month.year, M: month.month, d: a })"
    >
      <span
        v-if="range && isSameDate(month.month, a, month.year, fromDate)"
        class="s-datepicker__date--circle"
      >
        {{a}}
      </span>
      <span
        v-else-if="range && isSameDate(month.month, a, month.year, toDate)"
        class="s-datepicker__date--circle"
      >
        {{a}}
      </span>
      <span v-else-if="!range && isSameDate(month.month, a, month.year, selectedDate)"
        class="s-datepicker__date--circle">
        {{a}}
      </span>
      <span v-else>{{a}}</span>
    </span>
    <span
      class="s-datepicker__date--overlapping"
      v-for="(x, k) in (6 - month.lastDay)"
      :key="`${x}-${month.month}-${k}`"
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
    setDateClasses(m: number, d: number, y: number) {
      let classes = [];
      if (this.range) {
        if (this.isInPeriod(m, d, y, this.fromDate, this.toDate)) {
          classes.push('s-datepicker__date--between');
        }
        if (this.isSameDate(m, d, y, this.fromDate)) {
          classes.push('s-datepicker__date--from');
        }
        if (this.isSameDate(m, d, y, this.toDate)) {
          classes.push('s-datepicker__date--to');
        }
      }
      if (this.isSaturday(m, d, y)) {
        classes.push('s-datepicker__date--saturday');
      }
      if (this.isSunday(m, d, y)) {
        classes.push('s-datepicker__date--sunday');
      }
      if (this.isSameDate(m, d, y, this.today)) {
        classes.push('s-datepicker__date--today');
      }

      return classes;
    },

    translateMonthName(monthKey: number, year: number) {
      return moment([year, (monthKey - 1)]).format('MMMM-YYYY');
    },

    dayOfWeek(m: number, d: number, y: number) {
      return moment([y, (m - 1), d]).day();
    },

    isSaturday(m: number, d: number, y: number) {
      return moment([y, (m - 1), d]).day() === 6;
    },

    isSunday(m: number, d: number, y: number) {
      return moment([y, (m - 1), d]).day() === 0;
    },

    isSameDate(m: number, d: number, y: number, date: Moment): boolean {
      let dateInMonth = moment([y, (m - 1), d]).format('YYYY-MM-DD');
      let compareDate = moment(date).format('YYYY-MM-DD');
      return moment(dateInMonth).isSame(compareDate);
    },

    isInPeriod(m: number, d: number, y: number, fromDate: Moment, toDate: Moment): boolean {
      if (!this.range) return false;
      let dateInMonth = moment([y, (m - 1), d]).format('YYYY-MM-DD');
      let compareDateFrom = moment(fromDate).format('YYYY-MM-DD');
      let compareDateTo = moment(toDate).format('YYYY-MM-DD');
      return moment(dateInMonth).isBetween(compareDateFrom, compareDateTo);
    },

    mouseOverEvent(payload: IMomentPayload) {
      if (!this.mouseDrag) return;
      this.$emit('mouse-dragging', payload);
    },

    mouseClick(payload: IMomentPayload) {
      if (this.range) return;
      this.$emit('mouse-click', payload);
    },
  },
});
</script>
