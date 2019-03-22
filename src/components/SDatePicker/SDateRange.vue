<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen" :toggleOnClick="false">
      <template v-slot:activator>
        <div class="s-date-field-range-input" @click="open">
          <s-date-to-stringinput
            v-model="from"
            :locale="locale"
            :label="fromLabel"
            :format="format"
          />
          <s-date-to-stringinput
            v-model="to"
            :locale="locale"
            :label="toLabel"
            :format="format"
          />
        </div>
      </template>
      <template v-slot:content>
        <s-datepicker
          range
          :menu="withMenu"
          :locale="locale"
          :format="format"
          v-model="internalValue"
          :filter="internalFilter"
          @filter-update="filterUpdate"
        />
      </template>
    </s-menu>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import SMenu from '../SMenu.vue';
import SDatepicker from './SDatepicker.vue';
import SDateToStringinput from './SDateToStringinput.vue';
import { ICalendarPeriod, ICalendarFilter } from '../types';

export default Vue.extend({
  name: 's-date-range',

  components: {
    SMenu,
    SDateToStringinput,
    SDatepicker,
  },

  data() {
    return {
      isOpen: false,
      internalFilter: this.filter,
      internalValue: this.value as ICalendarPeriod,
      locale: moment.locale(this.localeString),
      format: moment.localeData().longDateFormat('L'),
    };
  },

  props: {
    withMenu: {
      type: Boolean,
      default: false,
    },
    localeString: String,
    filter: {} as () => ICalendarFilter,
    value: {} as any,
    fromLabel: String,
    toLabel: String,
  },

  computed: {
    from: {
      set(newValue: Moment) {
        this.internalValue.from = newValue;
      },
      get(): Moment {
        if (!this.internalValue) return moment();
        return this.internalValue.from;
      },
    },

    to: {
      set(newValue: Moment) {
        this.internalValue.to = newValue;
      },
      get(): Moment {
        if (!this.internalValue) return moment();
        return this.internalValue.to;
      },
    },

    menu(): Boolean {
      return this.withMenu;
    },
  },

  watch: {
    filter(newVal) {
      this.internalFilter = newVal;
    },

    value(newVal) {
      this.internalValue = newVal;
    },

    isOpen(newVal) {
      if (!newVal) {
        this.$emit('input', this.internalValue);
      }
    },
  },

  methods: {
    open() {
      this.isOpen = true;
    },

    filterUpdate(payload: any) {
      this.internalFilter = payload;
      this.$emit('updateFilter', payload);
    },
  },
});
</script>
