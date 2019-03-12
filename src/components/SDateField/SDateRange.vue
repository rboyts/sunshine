<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen" :toggleOnClick="false">
      <template v-slot:activator>
        <div
          class="s-date-field-range-input"
          @click="toggleOpen"
        >
          <s-text-field
            v-model="from"
            :format="format"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            :label="fromLabel"
            :class="validState(from)"
          />
          <s-text-field
            v-model="to"
            :format="format"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            :label="toLabel"
            :class="validState(to)"
          />
        </div>
      </template>
      <!-- content datepicker -->
      <!--
      :includeMenu="hasCalendarMenu"
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
          @setSelectedDate="setSelectedDate"
        />
      </template>

    </s-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import { ICalendarPeriod, IMomentPayload } from '../types';
import SMenu from '../SMenu.vue';
import SDatepicker from '../SDatepicker.vue';
import STextField from '../STextField.vue';

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
      isOpen: false,
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
      internalValue: {} as () => ICalendarPeriod,
      validStyle: 's-input--valid',
      errorStyle: 's-input--error',
    };
  },

  props: {
    value: {} as () => ICalendarPeriod,
    rangeInput: {
      type: Boolean,
      default: false,
    },
    fromDate: [Object, String],
    toDate: [Object, String],
    selectedDate: [Object, String],
    fromLabel: String,
    toLabel: String,
    label: String,
  },

  computed: {
    isRangeField(): boolean {
      return this.rangeInput;
    },

    fromMoment(): Moment | null {
      if (!this.from || this.from.length !== this.format.length) return null;
      return this.createMoment(this.from);
    },

    toMoment(): Moment | null{
      if (!this.to || this.to.length !== this.format.length) return null;
      return this.createMoment(this.to);
    },

    dateMoment(): Moment | null{
      if (!this.date || this.date.length !== this.format.length) return null;
      return this.createMoment(this.date);
    },

    formatSymbolIndicies(): number[] {
      const formatRegex = new RegExp(`[${this.formatSymbol}]`, 'g');
      const splitFormatString = this.format.split('');
      let formatSymbolIndicies = [];
      for (let a = 0, b = splitFormatString.length; a < b; a++) {
        if (splitFormatString[a].match(formatRegex) !== null) {
          formatSymbolIndicies.push(a);
        }
      }
      return formatSymbolIndicies;
    },

    formatSymbol(): string | null {
      let symbol = this.format.match(/[^\w]/g);
      if (symbol !== null) {
        return symbol[0];
      }
      return null;
    },
  },

  watch: {
    from(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.from = this.formatValue(newVal);
      }
      if (newVal.length === Number(this.format.length) &&
        this.validDate(newVal)) {
        this.from = this.momentFormatted(this.fromMoment);
      }
    },

    to(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.to = this.formatValue(newVal);
      }
      if (newVal.length === Number(this.format.length) &&
        this.validDate(newVal)) {
        this.to = this.momentFormatted(this.toMoment);
      }
    },

    date(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.date = this.formatValue(newVal);
      }
      if (newVal.length === Number(this.format.length) &&
        this.validDate(newVal)) {
        this.date = this.momentFormatted(this.dateMoment);
      }
    },

    isOpen(newVal, oldVal) {
      if (oldVal && !newVal) {
        // TODO: Validate if range is valid (ie. from date is before to date)?
      }
    },
  },

  methods: {
    momentFormatted(date: Moment | null): string {
      if (date === null) return '';
      return moment(date).format(this.format);
    },

    createMoment(dateString: string): Moment {
      let testStr = dateString.replace(`/[${this.formatSymbol}]/g`, '-');
      let momentDate = moment(testStr, this.format);
      return momentDate;
    },

    setSelectedPeriod(payload: ICalendarPeriod) {
      this.from = moment(payload.from).format(this.format);
      this.to = moment(payload.to).format(this.format);
    },

    setSelectedDate(payload: Moment) {
      this.date = moment(payload).format(this.format);
    },

    formatValue(input: string): string {
      for (let a = 0, b = this.formatSymbolIndicies.length; a < b; a++) {
        if (input.length === this.formatSymbolIndicies[a]) {
          return `${input}${this.formatSymbol}`;
        }
      }
      return input;
    },

    validState(value: string): string {
      if (value.length === Number(this.format.length)) {
        if (this.validDate(value)) {
          return this.validStyle;
        } else {
          return this.errorStyle;
        }
      } else {
        return '';
      }
    },

    validDate(value: string): boolean {
      return moment(value, this.format).isValid();
    },

    toggleOpen() {
      this.isOpen = true;
    },
  },

  mounted() {
    if (this.fromDate && moment.isMoment(this.fromDate)) {
      this.from = moment(this.fromDate).format(this.format);
    }
    if (this.toDate && moment.isMoment(this.toDate)) {
      this.to = moment(this.toDate).format(this.format);
    }
    if (this.selectedDate && moment.isMoment(this.selectedDate)) {
      this.date = moment(this.selectedDate).format(this.format);
    }
  },
});
</script>
