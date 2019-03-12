<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen" :toggleOnClick="false">
      <template v-slot:activator>
        <div
          class="s-date-field-single-input"
          @click="toggleOpen"
        >
        <!--
          watch:
            value: sets internal value
            internalValue: emits value Moment
          computed:
            date: Moment for datepicker and converter ?
          wrap s-text-field in converter:
            - date -> String
            - formats input
         -->
          <s-text-field
            moment
            v-model="internalValue"
            :format="format"
            :dateLocale="locale"
            :dateFormat="format"
            :label="label"
            :class="validState(internalValue)"
          />
        </div>
      </template>
      <!-- content datepicker -->
      <!--
      :includeMenu="hasCalendarMenu"
       -->
      <template v-slot:content>
        <s-datepicker
          :rangeSelect="rangeInput"
          :locale="locale"
          :format="format"
          :date="dateMoment"
          @setSelectedDate="setInternalValue"
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
      rangeInput: false,
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
      internalValue: '',
      validStyle: 's-input--valid',
      errorStyle: 's-input--error',
    };
  },

  props: {
    value: {} as () => Moment,
    label: String,
  },

  computed: {

    dateMoment(): Moment | null{
      if (!this.internalValue || this.internalValue.length !== this.format.length) return null;
      return this.createMoment(this.internalValue);
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
    value(newVal, oldVal) {
      // TODO: Move to string converter
      this.internalValue = moment(newVal).format(this.format);
    },

    internalValue(newVal, oldVal) {
      // EMIT value if valid Moment ?

      // TODO: Move to string converter
      if (newVal !== oldVal) {
        this.internalValue = this.formatValue(newVal);
      }
      if (newVal.length === Number(this.format.length) &&
        this.validDate(newVal)) {
        this.internalValue = this.momentFormatted(this.dateMoment);
      }
    },

    isOpen(newVal, oldVal) {
      if (oldVal && !newVal) {
        // TODO: Validate if range is valid (ie. from date is before to date)?
      }
      // If closed emits date
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

    setInternalValue(payload: Moment) {
      this.internalValue = moment(payload).format(this.format);
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
    if (this.value && moment.isMoment(this.value)) {
      // TODO: Move to string converter
      this.internalValue = moment(this.value).format(this.format);
    }
  },
});
</script>
