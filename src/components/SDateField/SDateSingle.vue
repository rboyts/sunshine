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
          <s-date-to-stringinput
            :value="date"
            :locale="locale"
            :label="label"
            :format="format"
          />
        </div>
      </template>
      <!-- content datepicker -->
      <!--
      :includeMenu="hasCalendarMenu"
       -->
      <template v-slot:content>
        <!-- <s-datepicker
          :rangeSelect="rangeInput"
          :locale="locale"
          :format="format"
          :date="date"
          @setSelectedDate="setInternalValue"
        /> -->
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
import SDateToStringinput from './SDateToStringinput.vue';

moment.locale('nb');

export default Vue.extend({
  name: 's-date-field',

  components: {
    SMenu,
    SDateToStringinput,
    SDatepicker,
  },

  data() {
    return {
      isOpen: false,
      rangeInput: false,
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
      internalValue: moment(),
    };
  },

  props: {
    value: {} as () => Moment,
    label: String,
  },

  computed: {
    // date(): Moment | null {
    //   if (!moment.isMoment(this.internalValue)) return null;
    //   return this.internalValue;
    // },
  },

  watch: {
    value(newVal, oldVal) {
      // TODO: Move to string converter
      this.internalValue = moment(newVal);
    },

    internalValue(newVal, oldVal) {
      if (moment.isMoment(this.internalValue)) {
        this.$emit('input', newVal);
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

    toggleOpen() {
      this.isOpen = true;
    },
  },
});
</script>
