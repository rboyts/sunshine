<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen">
      <template v-slot:activator>
        <div v-if="isRangeField" class="s-date-field-range-input">
          <s-text-field
            v-model="from"
            format="dd.mm.åååå"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Fra dato"
          />
          <s-text-field
            v-model="to"
            format="dd.mm.åååå"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Til dato"
          />
        </div>
        <div v-else class="s-date-field-single-input">
          <s-text-field
            v-model="date"
            format="dd.mm.åååå"
            :dateLocale="locale"
            :dateFormat="format"
            moment
            label="Dato"
          />
        </div>
      </template>
      <!-- content datepicker -->
      <!--
      // TODO:
      Fix menu date props
      :includeMenu="hasCalendarMenu"
       -->
      <template v-slot:content>
        <s-datepicker
          :rangeSelect="isRangeField"
          :locale="locale"
          :format="format"
          :from="testFromDate"
          :to="testToDate"
          :date="testSelectedDate"
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

// TODO: Stop moment to return todays date when from, to and date is not set by props

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
    };
  },

  props: {
    rangeInput: {
      type: Boolean,
      default: false,
    },
    fromDate: {} as () => moment.Moment,
    toDate: {} as () => moment.Moment,
    selectedDate: {} as () => moment.Moment,
  },

  computed: {

    isRangeField(): boolean {
      return this.rangeInput;
    },

    testFromDate(): Moment | null {
      if (this.rangeInput) {
        return this.fromDate;
      }
      return null;
    },

    testToDate(): Moment | null {
      if (this.rangeInput) {
        return this.toDate;
      }
      return null;
    },

    testSelectedDate(): Moment | null {
      if (!this.rangeInput) {
        return this.selectedDate;
      }
      return null;
    },

    from(): string {
      return moment(this.fromDate).format(this.format);
    },

    to(): string {
      return moment(this.toDate).format(this.format);
    },

    date(): string {
      return moment(this.selectedDate).format(this.format);
    },
  },

  methods: {
    setSelectedPeriod(period: ICalendarPeriod) {
      this.$emit('input', period);
    },

    setSelectedDate(date: Moment) {
      this.$emit('input', date);
    },
  },

  mounted() {
    console.log('Range ', this.isRangeField);
    console.log(this.from, this.to, this.date);
  },
});
</script>
