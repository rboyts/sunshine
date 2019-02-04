<template>
  <div class="s-datepicker__menu">
    <div>
      <p>Valgt periode:</p>
      <p>{{fromDate}} - {{toDate}}</p>
      <hr />
    </div>
    <!--<div>
      <p>Forrige</p>
      <p>Denne</p>
      <p>Neste</p>
      <hr />
    </div>-->
    <div>
      <p @click="selectPeriod('day')">Dag</p>
      <p @click="selectPeriod('week')">Uke</p>
      <p @click="selectPeriod('month')">Måned</p>
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { IMonth, ICalendarPeriod } from '../types';

moment.locale('nb');

export default Vue.extend({
  name: 's-datepicker-menu',
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
  methods: {
    selectPeriod(period) {
      switch(period) {
        case 'day':
          this.$emit('setSelectedPeriod', this.today);
          this.$emit('setSelectedPeriod', this.today);
          break;
        case 'week':
          this.$emit('setSelectedPeriod', moment(this.today).startOf('week'));
          this.$emit('setSelectedPeriod', moment(this.today).endOf('week').subtract(2, 'd'));
          break;
        case 'month':
          this.$emit('setSelectedPeriod', moment(this.today).startOf('month'));
          this.$emit('setSelectedPeriod', moment(this.today).endOf('month'));
          break;
      };
    },
  },
});
</script>