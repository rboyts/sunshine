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
      v-for="(x, k) in (7 - month.lastDay)"
      :key="`${x}-${month.month}-${k}`"
    >{{ x }}</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { DateTime, Interval } from 'luxon';
import { IMonth, IMomentPayload } from '../types';

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
      type: Object as () => DateTime,
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
    fromDate(): DateTime | undefined {
      return this.range ? this.value.interval && this.value.interval.start : undefined;
    },

    toDate(): DateTime | undefined {
      return this.range ? this.value.interval && this.value.interval.end : undefined;
    },

    monthName(): string {
      const { month, year } = this.month;
      return DateTime.local(year, month).toFormat('MMMM yyyy');
    },
  },

  methods: {
    getDateClasses(m: number, d: number, y: number) {
      const hasRange = this.range && !!this.fromDate && !!this.toDate;
      const date = DateTime.local(y, m, d);
      return this.$class('date', {
        between: hasRange && this.isInPeriod(date, this.fromDate, this.toDate),
        from: hasRange && this.isSameDate(date, this.fromDate),
        to: hasRange && this.isSameDate(date, this.toDate),
        saturday: date.weekday === 6,
        sunday: date.weekday === 7,
        today: this.isSameDate(date, this.today),
      });
    },

    hasDateCircle(dateInMonth: number): Boolean {
      const { month, year } = this.month;
      const date = DateTime.local(year, month, dateInMonth);
      return (
        (this.range && this.isSameDate(date, this.fromDate)) ||
        (this.range && this.isSameDate(date, this.toDate)) ||
        (!this.range && this.isSameDate(date, this.value.date))
      );
    },

    isSameDate(date: DateTime, compareDate: DateTime | undefined): boolean {
      return !!compareDate && date.hasSame(compareDate, 'day');
    },

    isInPeriod(
      date: DateTime,
      fromDate: DateTime | undefined,
      toDate: DateTime | undefined,
    ): boolean {
      if (!this.range) return false;
      if (!fromDate || !toDate) return false;
      return Interval.fromDateTimes(fromDate, toDate).contains(date);
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
