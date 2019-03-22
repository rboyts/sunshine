<template>
  <div class="s-datepicker__menu">
    <h3>Periodevalg</h3>
    <div class="s-datepicker__menu__row">

      <div class="s-datepicker__menu__column">
        <p v-for="filter in options" :key="filter">
          <s-radio-button v-model="periodOption" :value="filter">{{filter}}</s-radio-button>
        </p>
      </div>

      <div class="s-datepicker__menu__column">
        <p v-for="filter in periods" :key="filter">
          <s-radio-button v-model="periodPreselect" :value="filter">{{filter}}</s-radio-button>
        </p>
      </div>

    </div>
    <h3>Egne perioder</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import {
  IMonth,
  ICalendarPeriod,
  ICalendarFilter,
  ICalendarPeriodFilter,
  ICalendarOptionFilter,
} from '../types';
import SRadioButton from '../SRadioButton.vue';

export default Vue.extend({
  name: 's-datepicker-menu',

  components: { SRadioButton },

  data() {
    return {
      options: ICalendarOptionFilter,
      periods: ICalendarPeriodFilter,
      periodOption: String(this.filter.option),
      periodPreselect: String(this.filter.period) as moment.unitOfTime.DurationConstructor,
    };
  },

  props: {
    filter: {} as () => ICalendarFilter,
    locale: String,
    format: String,
    today: {} as () => Moment,
    selectedPeriod: {} as () => ICalendarPeriod,
    selectedDate: {} as () => Moment,
  },

  watch: {
    periodPreselect(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectPeriod(newVal);
      }
    },

    periodOption(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.handlePeriodOption(newVal);
      }
    },
  },

  methods: {
    setDateSelection(option: string, period: moment.unitOfTime.DurationConstructor) {
      let fromDate: Moment;
      let toDate: Moment;
      let moveDateAmount = 1;
      switch (option) {
        case ICalendarOptionFilter.Previous:
          this.$emit(
            'set-period',
            moment(this.today)
              .subtract(moveDateAmount, period)
              .startOf(period),
            moment(this.today)
              .subtract(moveDateAmount, period)
              .endOf(period),
          );
          break;
        case ICalendarOptionFilter.Current:
          this.$emit(
            'set-period',
            moment(this.today).startOf(period),
            moment(this.today).endOf(period),
          );
          break;
        case ICalendarOptionFilter.Next:
          this.$emit(
            'set-period',
            moment(this.today).add(moveDateAmount, period).startOf(period),
            moment(this.today).add(moveDateAmount, period).endOf(period),
          );
          break;
      }
      this.$emit('set-filter', { option, period: String(period) });
    },

    handlePeriodOption(option: ICalendarOptionFilter) {
      this.setDateSelection(option, this.periodPreselect);
    },

    selectPeriod(period: ICalendarPeriodFilter) {
      this.setDateSelection(this.periodOption,
        String(period) as moment.unitOfTime.DurationConstructor);
    },
  },

  mounted() {
    if (this.filter) {
      this.setDateSelection(this.filter.option,
        String(this.filter.period) as moment.unitOfTime.DurationConstructor);
    }
  },
});
</script>
