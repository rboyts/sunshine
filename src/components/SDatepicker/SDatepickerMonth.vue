<template>
  <span class="s-datepicker__grid">
    <h3 class="s-datepicker__month">{{ translateMonthName(month.month, month.year) }}</h3>
    <div class="s-datepicker__weeks">
      <span
        class="s-datepicker__weeks__week"
        v-for="w in month.weeksInMonth"
        :key="w"
      >{{ w }}</span>
    </div>
    <span
      class="s-datepicker__date--overlapping"
      v-for="(x, k) in month.previousMonthDays"
      :key="`${x}-${month.month}-${k}`"
    >{{ x }}</span>
    <span
      class="s-datepicker__date"
      v-for="a in month.daysInMonth"
      :key="`${a}-${month.month}`"
      :class="setDateClasses(month.month, a, month.year)"
      @click="mouseClick({ y: month.year, M: month.month, d: a })"
      @mousedown="mousedown({ y: month.year, M: month.month, d: a }, $event)"
      @mouseup="$emit('mouse-drag-end', { y: month.year, M: month.month, d: a })"
      @mouseover="mouseOverEvent({ y: month.year, M: month.month, d: a })"
    >
      <span :class="{ 's-datepicker__date--circle': hasDateCircle(a) }">
        {{ a }}
      </span>
    </span>
    <span
      class="s-datepicker__date--overlapping"
      v-for="(x, k) in (6 - month.lastDay)"
      :key="`${x}-${month.month}-${k}`"
    >{{ x }}</span>
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
  name: 'SDatepickerMonth',

  props: {
    range: {
      type: Boolean,
      required: true,
    },

    month: {
      type: Object as () => IMonth,
      required: true,
    },

    today: {
      type: Object as () => Moment,
      required: true,
    },

    mouseDrag: {
      type: Boolean,
      required: true,
    },

    /**
     * Input value, same as for SDatepicker.
     */
    value: {
      type: Object,
      required: true,
    },
  },

  computed: {
    fromDate(): Moment | undefined {
      return this.range ? this.value.from : undefined;
    },

    toDate(): Moment | undefined {
      return this.range ? this.value.to : undefined;
    },
  },

  methods: {
    setDateClasses(m: number, d: number, y: number) {
      let classes = [];
      if (this.range && this.fromDate && this.toDate) {
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

    hasDateCircle(dateInMonth: number): Boolean {
      const { month, year } = this.month;
      return (
        (this.range && this.isSameDate(month, dateInMonth, year, this.fromDate)) ||
        (this.range && this.isSameDate(month, dateInMonth, year, this.toDate)) ||
        (!this.range && this.isSameDate(month, dateInMonth, year, this.value))
      );
    },

    isSameDate(m: number, d: number, y: number, date: Moment | undefined): boolean {
      if (!date) return false;
      let dateInMonth = moment([y, (m - 1), d]).format('YYYY-MM-DD');
      let compareDate = moment(date).format('YYYY-MM-DD');
      return moment(dateInMonth).isSame(compareDate);
    },

    isInPeriod(m: number, d: number, y: number, fromDate: Moment, toDate: Moment): boolean {
      if (!fromDate || !toDate) return false;
      if (!this.range) return false;
      let dateInMonth = moment([y, (m - 1), d]).format('YYYY-MM-DD');
      let compareDateFrom = moment(fromDate).format('YYYY-MM-DD');
      let compareDateTo = moment(toDate).format('YYYY-MM-DD');
      return moment(dateInMonth).isBetween(compareDateFrom, compareDateTo);
    },

    mousedown(payload: IMomentPayload, event: any) {
      if (event.button > 0) return;
      this.$emit('mouse-drag-start', payload);
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
