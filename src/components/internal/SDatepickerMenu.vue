<template>
  <div class="s-datepicker__menu">
    <div>
      <p>Valgt periode:</p>
      <p>{{fromDate}} - {{toDate}}</p>
      <hr />
    </div>
    <s-radio-group v-model="periodOption">
      <p>
        <s-radio-button name="periodOption" value="previous">Forrige</s-radio-button>
      </p>
      <p>
        <s-radio-button name="periodOption" value="current">Denne</s-radio-button>
      </p>
      <p>
        <s-radio-button name="periodOption" value="next">Neste</s-radio-button>
      </p>
    </s-radio-group>
    <hr/>
    <s-radio-group v-model="periodPreselect">
      <p>
        <s-radio-button name="periodPreselect" value="day">Dag</s-radio-button>
      </p>
      <p>
        <s-radio-button name="periodPreselect" value="week">Uke</s-radio-button>
      </p>
      <p>
        <s-radio-button name="periodPreselect" value="month">Måned</s-radio-button>
      </p>
    </s-radio-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod } from '../types';
import SRadioGroup from '../SRadioGroup.vue';
import SRadioButton from '../SRadioButton.vue';

moment.locale('nb');

export default Vue.extend({
  name: 's-datepicker-menu',
  components: { SRadioGroup, SRadioButton },
  data() {
    return {
      periodPreselect: 'week' as moment.unitOfTime.DurationConstructor,
      periodOption: 'current',
    };
  },
  props: {
    today: Object as () => Moment,
    selectedPeriod: Object as () => ICalendarPeriod,
  },
  computed: {
    toDate(): string {
      return moment(this.selectedPeriod.to).format('DD-MM-YYYY');
    },

    fromDate(): string {
      return moment(this.selectedPeriod.from).format('DD-MM-YYYY');
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
          this.$emit('setSelectedPeriod', moment(this.today).subtract(moveDateAmount, period).startOf(period));
          this.$emit('setSelectedPeriod', moment(this.today).subtract(moveDateAmount, period).endOf(period));
          break;
        case 'current':
          this.$emit('setSelectedPeriod', moment(this.today).startOf(period));
          this.$emit('setSelectedPeriod', moment(this.today).endOf(period));
          break;
        case 'next':
          this.$emit('setSelectedPeriod', moment(this.today).add(moveDateAmount, period).startOf(period));
          this.$emit('setSelectedPeriod', moment(this.today).add(moveDateAmount, period).endOf(period));
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