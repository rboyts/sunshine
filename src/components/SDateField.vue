<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen">
      <template v-slot:activator>
        <div v-if="isRangeField" class="s-date-field-range-input">
          <s-text-field
            v-model="formattedInputFrom"
            format="dd.mm.åååå"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Fra dato"
            @input="setSelectedPeriodFrom"
          />
          <s-text-field
            v-model="formattedInputTo"
            format="dd.mm.åååå"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Til dato"
            @input="setSelectedPeriodTo"
          />
        </div>
        <div v-else class="s-date-field-single-input">
          <s-text-field
            v-model="input"
            format="dd.mm.åååå"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Dato"
            @input="onInput"
          />
        </div>
      </template>
      <!-- content datepicker -->
      <template v-slot:content>
        <!--
          Possible props:
          includeMenu, (adds menu)
          rangeSelect, (enables rangeselect) (WIP),
          from: date, (default if !rangeSelect && !selectedDate)
          to: date,
          date: date
        -->
        <!--
          TODO: differentiate between single date select
          and range select in datepicker
        -->
        <s-datepicker
          :rangeSelect="isRangeField"
          :date="date"
          :from="from"
          :to="to"
          :locale="locale"
          :format="format"
          v-model="input"
          @setSelectedPeriod="setSelectedPeriod"
        />
      </template>

    </s-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { ICalendarPeriod } from './types';
import SMenu from './SMenu.vue';
import SDatepicker from './SDatepicker.vue';
import STextField from './STextField.vue';

moment.locale('nb');

export default Vue.extend({
  name: 's-date-field',

  components: {
    SMenu,
    SDatepicker,
    STextField,
  },

  data() {
    return {
      // TODO: Remove
      from: moment({ y: 2019, M: 1, d: 25 }),
      to: moment({ y: 2019, M: 1, d: 28 }),
      date: moment({ y: 2019, M: 1, d: 1 }),
      isOpen: false,
      input: '',
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
    };
  },

  props: {
    rangeInput: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isRangeField(): boolean {
      return this.rangeInput;
    },

    formattedInputFrom(): string {
      return moment(this.from).format(this.format);
    },

    formattedInputTo(): string {
      return moment(this.to).format(this.format);
    },
  },

  methods: {
    // TODO: Handle change of dates from input

    onInput(input: string) {
      this.input = input;
    },

    setSelectedPeriodTo(input: string) {
      console.log(input);
    },

    setSelectedPeriodFrom(input: string) {
      console.log(input);
    },

    setSelectedPeriod(period: ICalendarPeriod) {
      this.from = period.from;
      this.to = period.to;
    },
  },
});
</script>
