<template>
  <span :class="$class('grid')">
    <h3 :class="$class('month')">{{ monthName }}</h3>
    <div :class="$class('weeks')">
      <span
        :class="$class('weeks', 'week')"
        v-for="w in weeksInMonth"
        :key="w"
      >{{ w }}</span>
    </div>
    <span
      v-for="day in days"
      :key="day.value"
      :class="getDateClasses(day)"
      @click="onMouseClick(day)"
      @mousedown.left="$emit('mouse-drag-start', day)"
      @mouseup.left="$emit('mouse-drag-end', day)"
      @mouseover.left="onMouseOver(day)"
    >
      <span :class="{ 's-datepicker__date--circle': hasDateCircle(day) }">
        {{ day.day }}
      </span>
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { DateTime, Interval } from 'luxon';

export default Vue.extend({
  name: 'SDatepickerMonth',

  // CSS class names start with 's-datepicker' instead of 's-datepicker-month'
  $_className: 's-datepicker',

  props: {
    range: {
      type: Boolean,
      required: true,
    },

    dateContext: {
      type: Object as () => DateTime,
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

    weeksInMonth(): number[] {
      const s = this.dateContext.startOf('month');
      const e = this.dateContext.endOf('month');

      const weeks: number[] = [];
      for (let d = s; d < e; d = d.plus({ week: 1 })) {
        weeks.push(d.weekNumber);
      }

      return weeks;
    },

    days(): DateTime[] {
      const s = this.dateContext.startOf('month').startOf('week');
      const e = this.dateContext.endOf('month').endOf('week');

      const days: DateTime[] = [];
      for (let d = s; d < e; d = d.plus({ day: 1 })) {
        days.push(d);
      }

      return days;
    },

    monthName(): string {
      return this.dateContext.toFormat('MMMM yyyy');
    },
  },

  methods: {
    getDateClasses(date: DateTime) {
      const hasRange = this.range && !!this.fromDate && !!this.toDate;
      return this.$class('date', {
        between: hasRange && this.isInPeriod(date, this.fromDate, this.toDate),
        from: hasRange && this.isSameDate(date, this.fromDate),
        to: hasRange && this.isSameDate(date, this.toDate),
        saturday: date.weekday === 6,
        sunday: date.weekday === 7,
        today: this.isSameDate(date, this.today),
        overlapping: !this.dateContext.hasSame(date, 'month'),
      });
    },

    hasDateCircle(date: DateTime): boolean {
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

    onMouseOver(date: DateTime) {
      if (!this.mouseDrag) return;
      this.$emit('mouse-dragging', date);
    },

    onMouseClick(date: DateTime) {
      if (this.range) return;
      this.$emit('mouse-click', date);
    },
  },
});
</script>
