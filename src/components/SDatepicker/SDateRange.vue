<template>
  <div class="s-date-field">
    <s-menu
      v-model="isOpen"
      :toggle-on-click="false"
    >
      <template v-slot:activator>
        <s-base-input
          class="s-date-field-range-input"
          :class="{
            's-date-field-range-input--focus': isOpen,
            's-date-field-filter-selected': filterSelected,
          }"
          :label="label"
          :is-empty="false"
          @click="open"
        >
          <div class="s-date-field-period">
            <s-date-to-stringinput
              v-model="from"
              :locale="locale"
              :format="format"
              :filter="internalFilter.option"
              @filter-update="updateFilter"
            />
            <span class="s-date-field-range-symbol">-</span>
            <s-date-to-stringinput
              v-model="to"
              :locale="locale"
              :format="format"
              :filter="internalFilter.period"
              @filter-update="updateFilter"
            />
          </div>
        </s-base-input>
      </template>
      <template v-slot:content>
        <s-datepicker
          range
          :menu="withMenu"
          :locale="locale"
          :format="format"
          v-model="internalValue"
          :filter="internalFilter"
          :filter-selected="filterSelected"
          @filter-update="updateFilter"
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

// TODO: Reset filter when user selects range manually

// TODO (Robin):
// - Remove all the locale stuff. Should use moment or vue-i18n config
// - Look into v-model data structure
// - When a period is selected, use _one_ input to show the value as a text

export default Vue.extend({
  name: 'SDateRange',

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
    label: String,
  },

  computed: {
    from: {
      set(newValue: Moment) {
        if (newValue === null) {
          this.internalValue.from = null;
        } else {
          this.internalValue.from = newValue;
        }
      },
      get(): Moment | null | string {
        if (!this.internalValue) return null;
        return this.internalValue.from;
      },
    },

    to: {
      set(newValue: Moment) {
        if (newValue === null) {
          this.internalValue.to = null;
        } else {
          this.internalValue.to = newValue;
        }
      },
      get(): Moment | null {
        if (!this.internalValue) return null;
        return this.internalValue.to;
      },
    },

    menu(): Boolean {
      return this.withMenu;
    },

    isEmpty(): Boolean {
      return !this.from && !this.to;
    },

    filterSelected(): boolean {
      return this.internalFilter.option !== '' && this.internalFilter.period !== '';
    },
  },

  watch: {
    value(newVal) {
      this.internalValue = newVal;
    },

    isOpen(newVal) {
      if (!newVal) {
        this.$emit('input', this.internalValue);
      }
    },

    filter(newVal) {
      this.internalFilter = newVal;
    },
  },

  methods: {
    open() {
      this.isOpen = true;
    },

    updateFilter(payload: any) {
      this.internalFilter = payload;
      this.$emit('update-filter', payload);
    },
  },
});
</script>
