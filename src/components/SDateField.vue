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
      <!--
      // TODO:
      Fix menu date props
       -->
      <template v-slot:content>
        <s-datepicker
          :includeMenu="hasCalendarMenu"
          :rangeSelect="isRangeField"
          :from="fromDate"
          :to="toDate"
          :date="singleDate"
          :locale="locale"
          :format="format"
          v-model="input"
          @setSelectedPeriod="setSelectedPeriod"
          @setSelectedDate="setSelectedDate"
        />
      </template>

    </s-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { ICalendarPeriod, IMomentPayload } from './types';
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
      from: moment({ y: 2019, M: 2, d: 18 }),
      to: moment({ y: 2019, M: 2, d: 23 }),
      date: moment({ y: 2019, M: 2, d: 1 }),
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
    includeMenu: {
      type: Boolean,
      default: false,
    },
    rangeFrom: {} as () => moment.Moment,
    rangeTo: {} as () => moment.Moment,
    selectedDate: {} as () => moment.Moment,
  },

  computed: {
    isRangeField(): boolean {
      return this.rangeInput;
    },

    hasCalendarMenu(): boolean {
      return this.includeMenu;
    },

    formattedInputFrom(): string {
      return moment(this.from).format(this.format);
    },

    formattedInputTo(): string {
      return moment(this.to).format(this.format);
    },

    fromDate(): Moment {
      return this.from;
    },

    toDate(): Moment {
      return this.to;
    },

    singleDate(): Moment {
      return this.date;
    },
  },

  methods: {
    onInput(input: string) {
      this.input = input;
    },

    setSelectedDate(date: Moment) {
      this.date = date;
      this.input = moment(this.date).format(this.format);
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
