<template>
  <div class="s-datepicker__menu">
    <h3>Periodevalg</h3>
    <div class="s-datepicker__menu__row">
      <div class="s-datepicker__menu__column">
        <p>
          <s-radio-button v-model="periodOption" value="previous">Forrige</s-radio-button>
        </p>
        <p>
          <s-radio-button v-model="periodOption" value="current">Denne</s-radio-button>
        </p>
        <p>
          <s-radio-button v-model="periodOption" value="next">Neste</s-radio-button>
        </p>
      </div>

      <div class="s-datepicker__menu__column">
        <p>
          <s-radio-button v-model="periodPreselect" value="day">Dag</s-radio-button>
        </p>
        <p>
          <s-radio-button v-model="periodPreselect" value="week">Uke</s-radio-button>
        </p>
        <p>
          <s-radio-button v-model="periodPreselect" value="month">Måned</s-radio-button>
        </p>
      </div>
    </div>
    <h3>Egendefinerte</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod } from '../types';
import SRadioButton from '../SRadioButton.vue';

export default Vue.extend({
  name: 's-datepicker-menu',

  components: { SRadioButton },

  data() {
    return {
      periodPreselect: 'week' as moment.unitOfTime.DurationConstructor,
      periodOption: 'current',
    };
  },

  props: {
    locale: String,
    format: String,
    today: {} as () => Moment,
    selectedPeriod: {} as () => ICalendarPeriod,
    selectedDate: {} as () => Moment,
  },

  computed: {
    toDate(): string {
      return moment(this.selectedPeriod.to).format('L');
    },

    fromDate(): string {
      return moment(this.selectedPeriod.from).format('L');
    },
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
        case 'previous':
          this.$emit(
            'setSelectedPeriod',
            moment(this.today)
              .subtract(moveDateAmount, period)
              .startOf(period),
            moment(this.today)
              .subtract(moveDateAmount, period)
              .endOf(period),
          );
          break;
        case 'current':
          this.$emit(
            'setSelectedPeriod',
            moment(this.today).startOf(period),
            moment(this.today).endOf(period),
          );
          break;
        case 'next':
          this.$emit(
            'setSelectedPeriod',
            moment(this.today).add(moveDateAmount, period).startOf(period),
            moment(this.today).add(moveDateAmount, period).endOf(period),
          );
          break;
      }
    },

    handlePeriodOption(option: string) {
      this.setDateSelection(option, this.periodPreselect);
    },

    selectPeriod(period: moment.unitOfTime.DurationConstructor) {
      this.setDateSelection(this.periodOption, period);
    },
  },
});
</script>
