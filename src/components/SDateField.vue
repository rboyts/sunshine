<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen">
      <template v-slot:activator>
        <div v-if="isRangeField" class="s-date-field-range-input">
          <s-text-field
            v-model="from"
            :format="stringFormat"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Fra dato"
            @input="setFromDate"
          />
          <s-text-field
            v-model="to"
            :format="stringFormat"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Til dato"
            @input="setToDate"
          />
        </div>
        <div v-else class="s-date-field-single-input">
          <s-text-field
            v-model="date"
            :format="stringFormat"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Dato"
            @input="setDate"
          />
        </div>
      </template>
      <!-- content datepicker -->
      <!--
      :includeMenu="hasCalendarMenu"
      :date="date"
      @setSelectedPeriod="setSelectedPeriod"
      @setSelectedDate="setSelectedDate"
       -->
      <template v-slot:content>
        <s-datepicker
          :rangeSelect="isRangeField"
          :locale="locale"
          :format="format"
          :from="fromMoment"
          :to="toMoment"
          :date="dateMoment"
          @setSelectedPeriod="setSelectedPeriod"
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

// TODO: set date from input
// TODO: Fix menu date props
// TODO: Handle dates differently, cant input when props not set

export default Vue.extend({
  name: 's-date-field',

  components: {
    SMenu,
    SDatepicker,
    STextField,
  },

  data() {
    return {
      isOpen: false,
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
      from: '',
      to: '',
      date: '',
      dateMoment: {} as any,
      fromMoment: {} as any,
      toMoment: {} as any,
    };
  },

  props: {
    rangeInput: {
      type: Boolean,
      default: false,
    },
    stringFormat: {
      type: String,
      default: 'dd.mm.åååå',
    },
    fromDate: String,
    toDate: String,
    selectedDate: String,
  },

  computed: {
    isRangeField(): boolean {
      return this.rangeInput;
    },
  },

  methods: {
    formatSymbol(): string | undefined {
      return (this.format) ? this.stringFormat.match(/[^\w]/g)[0] : undefined;
    },

    momentFormatted(date: Moment): string {
      return moment(date).format(this.format);
    },

    createMoment(dateString: string): Moment {
      let testStr = dateString.replace(`/[${this.formatSymbol}]/g`, '-');
      let momentDate = moment(testStr, this.format);
      return momentDate;
    },

    setFromDate(value: string) {
      if (value.length === Number(this.stringFormat.length)) {
        this.fromMoment = this.createMoment(value);
        this.from = this.momentFormatted(this.fromMoment);
      }
    },

    setToDate(value: string) {
      if (value.length === Number(this.stringFormat.length)) {
        this.toMoment = this.createMoment(value);
        this.to = this.momentFormatted(this.toMoment);
      }
    },

    setDate(value: string) {
      if (value.length === Number(this.stringFormat.length)) {
        this.dateMoment = this.createMoment(value);
        this.date = this.momentFormatted(this.dateMoment);
      }
    },

    setSelectedPeriod(payload: ICalendarPeriod) {
      this.setFromDate(moment(payload.from).format(this.format));
      this.setToDate(moment(payload.to).format(this.format));
    },
  },
});
</script>
