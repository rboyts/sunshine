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
            <s-date-input
              v-model="internalStartDate"
            />
            <span class="s-date-field-range-symbol">-</span>
            <s-date-input
              v-model="internalEndDate"
            />
          </div>
        </s-base-input>
      </template>
      <template v-slot:content>
        <s-datepicker
          v-model="internalValue"
          range
          :with-menu="withMenu"
        />
      </template>
    </s-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DateTime, Interval } from 'luxon';
import SMenu from '../SMenu.vue';
import SDatepicker from './SDatepicker.vue';
import SDateInput from './SDateInput.vue';
import { IDatepickerValue } from '../types';

// TODO: Reset preset when user selects range manually

// TODO (Robin):
// - Rename CSS classes accoring to BEM conventions ($class)
// - Replace `value.preset` with a single key value, e.g.
//   { option: 'Current', period: 'Month' } shall be like 'CurrentMonth'.

export default Vue.extend({
  name: 'SDateRange',

  components: {
    SMenu,
    SDateInput,
    SDatepicker,
  },

  props: {

    /**
     * Value is an object with the following attributes:
     *
     * @param {Interval} interval Selected period.
     * @param {String} preset Chosen preset (e.g. CurrentMonth).
     */
    value: {
      type: Object as () => IDatepickerValue,
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
  },

  data() {
    return {
      isOpen: false,
      internalStartDate: undefined as DateTime | undefined,
      internalEndDate: undefined as DateTime | undefined,
      internalValue: {
        interval: undefined,
        preset: undefined,
      } as IDatepickerValue,
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

    internalValue(val: IDatepickerValue) {
      if (val && val.interval && val.interval.isValid) {
        this.internalStartDate = val.interval.start;
        this.internalEndDate = val.interval.end;
      }
    },

    internalStartDate(val) {
      if (val && this.internalValue.interval &&
          this.internalValue.interval.start.equals(val)) return;

      const end = this.internalEndDate;
      if (val && val.isValid && end && end.isValid) {
        this.internalValue = {
          interval: Interval.fromDateTimes(val, end),
        };
      }
    },

    internalEndDate(val) {
      if (val && this.internalValue.interval &&
          this.internalValue.interval.end.equals(val)) return;

      const start = this.internalStartDate;
      if (val && val.isValid && start && start.isValid) {
        this.internalValue = {
          interval: Interval.fromDateTimes(start, val),
        };
      }
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
