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
          />
          <s-text-field
            v-model="to"
            :format="stringFormat"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Til dato"
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
      isOpen: false,
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
      from: '',
      to: '',
      date: '',
    };
  },

  props: {
    rangeInput: {
      type: Boolean,
      default: false,
    },
    stringFormat: String,
    fromDate: String,
    toDate: String,
    selectedDate: String,
  },

  computed: {
    isRangeField(): boolean {
      return this.rangeInput;
    },

    fromMoment(): Moment {
      return this.createMoment(this.from);
    },

    toMoment(): Moment {
      return this.createMoment(this.to);
    },

    dateMoment(): Moment {
      return this.createMoment(this.date);
    },
  },

  watch: {
    from(value) {
      if (value.length === Number(this.stringFormat.length)) {
        this.from = this.momentFormatted(this.fromMoment);
      }
      console.log(this.from);
      console.log(this.fromMoment);
    },

    to(value) {
      if (value.length === Number(this.stringFormat.length)) {
        this.to = this.momentFormatted(this.toMoment);
      }
      console.log(this.to);
    },

    date(value) {
      if (value.length === Number(this.stringFormat.length)) {
        this.date = this.momentFormatted(this.dateMoment);
      }
      console.log(this.date);
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

    setSelectedPeriod(payload: ICalendarPeriod) {
      this.from = moment(payload.from).format(this.format);
      this.to = moment(payload.to).format(this.format);
    },

    setSelectedDate(payload: Moment) {
      this.date = moment(payload).format(this.format);
    },
  },
});
</script>
