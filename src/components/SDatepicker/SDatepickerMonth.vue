<template>
  <span :class="$class('grid')">
    <h3 :class="$class('month')">{{ monthName }}</h3>
    <div :class="$class('weeks')">
      <span
        :class="$class('weeks', 'week')"
        v-for="w in month.weeksInMonth"
        :key="w"
      >{{ w }}</span>
    </div>
    <span
      :class="$class('date', { overlapping: true })"
      v-for="(x, k) in month.previousMonthDays"
      :key="`${x}-${month.month}-${k}`"
    >{{ x }}</span>
    <span
      v-for="a in month.daysInMonth"
      :key="`${a}-${month.month}`"
      :class="getDateClasses(month.month, a, month.year)"
      @click="onMouseClick({ y: month.year, M: month.month, d: a })"
      @mousedown.left="$emit('mouse-drag-start', { y: month.year, M: month.month, d: a })"
      @mouseup.left="$emit('mouse-drag-end', { y: month.year, M: month.month, d: a })"
      @mouseover.left="onMouseOver({ y: month.year, M: month.month, d: a })"
    >
      <span :class="{ 's-datepicker__date--circle': hasDateCircle(a) }">
        {{ a }}
      </span>
    </span>
    <span
      :class="$class('date', { overlapping: true })"
      v-for="(x, k) in (6 - month.lastDay)"
      :key="`${x}-${month.month}-${k}`"
    >{{ x }}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod, IMomentPayload } from '../types';

export default Vue.extend({
  name: 'SDatepickerMonth',

  // CSS class names start with 's-datepicker' instead of 's-datepicker-month'
  $_className: 's-datepicker',

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

    monthName(): string {
      const { month, year } = this.month;
      return moment([year, (month - 1)]).format('MMMM-YYYY');
    },
  },

  methods: {
    getDateClasses(m: number, d: number, y: number) {
      const hasRange = this.range && !!this.fromDate && !!this.toDate;
      return this.$class('date', {
        between: hasRange && this.isInPeriod(m, d, y, this.fromDate, this.toDate),
        from: hasRange && this.isSameDate(m, d, y, this.fromDate),
        to: hasRange && this.isSameDate(m, d, y, this.toDate),
        saturday: this.isSaturday(m, d, y),
        sunday: this.isSunday(m, d, y),
        today: this.isSameDate(m, d, y, this.today),
      });
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
      let dateInMonth = moment([y, (m - 1), d]);
      return dateInMonth.isSame(date, 'day');
    },

    isInPeriod(
      m: number, d: number, y: number,
      fromDate: Moment | undefined,
      toDate: Moment | undefined,
    ): boolean {
      if (!fromDate || !toDate) return false;
      if (!this.range) return false;
      let dateInMonth = moment([y, (m - 1), d]);
      return dateInMonth.isBetween(fromDate, toDate, 'day');
    },

    onMouseOver(payload: IMomentPayload) {
      if (!this.mouseDrag) return;
      this.$emit('mouse-dragging', payload);
    },

    onMouseClick(payload: IMomentPayload) {
      if (this.range) return;
      this.$emit('mouse-click', payload);
    },
  },
});
</script>
