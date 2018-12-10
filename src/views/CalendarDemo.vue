<template>
  <div>
    <div class="options">
      <ui-button @click="onPrevClick">&lt;&lt;</ui-button>
      <ui-button @click="onTodayClick">{{ today }}</ui-button>
      <ui-button @click="onNextClick">&gt;&gt;</ui-button>
    </div>

    <ui-calendar :date="date" />
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import moment from 'moment';

export default Vue.extend({
  name: 'CalanderDemo',

  data() {
    let today = moment().startOf('day');
    return {
      date: today,
      today: today.format('LL'),
    };
  },

  methods: {
    onPrevClick() {
      this.date = moment(this.date).subtract(1, 'month');
    },

    onNextClick() {
      this.date = moment(this.date).add(1, 'month');
    },

    onTodayClick() {
      let today = moment().startOf('day');
      this.date = today;
    },
  },
});
</script>


<style lang="scss" scoped>
.options {
  margin-bottom: 20px;
  text-align: center;

  button {
    padding: 5px 10px;
    margin: 0 10px;
  }
}
</style>
