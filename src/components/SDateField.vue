<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen">
      <template v-slot:activator>
        <div v-if="isRangeField" class="s-date-field-range-input">
          <s-text-field
            v-model="from"
            :format="format"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Fra dato"
          />
          <s-text-field
            v-model="to"
            :format="format"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Til dato"
          />
        </div>
        <div v-else class="s-date-field-single-input">
          <s-text-field
            v-model="date"
            :format="format"
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
    fromDate: String,
    toDate: String,
    selectedDate: String,
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
  },

  watch: {
    from(value) {
      if (value.length === Number(this.format.length)) {
        this.from = this.momentFormatted(this.fromMoment);
      } else {
        console.log(this.fromDate);
      }
    },

    to(value) {
      if (value.length === Number(this.format.length)) {
        this.to = this.momentFormatted(this.toMoment);
      }
    },

    date(value) {
      if (value.length === Number(this.format.length)) {
        this.date = this.momentFormatted(this.dateMoment);
      }
    },
  },

  methods: {
    formatSymbol(): string | null {
      let symbol = this.format.match(/[^\w]/g);
      if (symbol !== null) {
        return symbol[0];
      }
      return null;
    },

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
  },

  mounted() {
    if (this.fromDate) {
      this.from = this.fromDate;
    }
    if (this.toDate) {
      this.to = this.toDate;
    }
    if (this.selectedDate) {
      this.date = this.selectedDate;
    }
  },
});
</script>
