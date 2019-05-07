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
          }"
          :label="label"
          :is-empty="false"
          @click="open"
        >
          <div
            v-if="internalValue.preset"
            class="s-drop-down__label s-drop-down__label--with-label"
          >
            {{ presetText }}
          </div>
          <div
            v-else
            class="s-date-field-period"
          >
            <s-date-to-stringinput
              v-model="internalValue.from"
              :locale="locale"
              :format="format"
            />
            <span class="s-date-field-range-symbol">-</span>
            <s-date-to-stringinput
              v-model="internalValue.to"
              :locale="locale"
              :format="format"
            />
          </div>
        </s-base-input>
      </template>
      <template v-slot:content>
        <s-datepicker
          v-model="internalValue"
          range
          :with-menu="withMenu"
          :locale="locale"
          :format="format"
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
import { ICalendarPeriod, IDateRangeValue } from '../types';

// TODO: Reset preset when user selects range manually

// TODO (Robin):
// - Remove all the locale stuff. Should use moment or vue-i18n config
// - Rename CSS classes accoring to BEM conventions (ClassesMixin)
// - Replace `value.preset` with a single key value, e.g.
//   { option: 'Current', period: 'Month' } shall be like 'CurrentMonth'.

export default Vue.extend({
  name: 'SDateRange',

  components: {
    SMenu,
    SDateToStringinput,
    SDatepicker,
  },

  props: {

    /**
     * Value is an object with the following attributes:
     *
     * @param {Moment} from Start of selected period.
     * @param {Moment} to End of selected period.
     * @param {String} preset Chosen preset (e.g. CurrentMonth).
     */
    value: {
      type: Object,
      default: undefined,
    },

    withMenu: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: '',
    },

    localeString: String,
  },

  data() {
    return {
      isOpen: false,
      internalValue: {
        from: null,
        to: null,
        preset: null,
      } as IDateRangeValue,
      locale: moment.locale(this.localeString),
      format: moment.localeData().longDateFormat('L'),
    };
  },

  computed: {
    // TODO i18n and custom presets
    presetText(): string {
      if (!this.internalValue.preset) return '';
      const { option, period } = this.internalValue.preset;
      return `${option} ${period.toLowerCase()}`;
    },
  },

  watch: {
    value(newVal) {
      this.internalValue = newVal;
    },

    // XXX Why not emit on every input?
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
  },
});
</script>
