<template>
  <div :class="$class()">
    <h3>Periodevalg</h3>
    <div :class="$class('row')">
      <div :class="$class('column')">
        <p
          v-for="option in options"
          :key="option"
        >
          <s-radio-button
            v-model="selectedOption"
            :value="option"
          >
            {{ $t(`s-datepicker.option.${option.toLowerCase()}`) }}
          </s-radio-button>
        </p>
      </div>

      <div :class="$class('column')">
        <p
          v-for="period in periods"
          :key="period"
        >
          <s-radio-button
            v-model="selectedPeriod"
            :value="period"
          >
            {{ $t(`s-datepicker.period.${period.toLowerCase()}`) }}
          </s-radio-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment, unitOfTime } from 'moment';
import {
  IDateRangePreset,
  IDateRangeValue,
  CalendarPeriod,
  CalendarOption,
} from '../types';
import SRadioButton from '../SRadioButton.vue';

export default Vue.extend({
  name: 'SDatepickerMenu',

  components: { SRadioButton },

  props: {
    /**
     * Input value, same as for SDatepicker.
     */
    value: {
      type: Object,
      required: true,
    },

    today: {
      type: Object as () => Moment,
      required: true,
    },
  },

  data() {
    return {
      options: CalendarOption,
      periods: CalendarPeriod,
      internalValue: this.value,
    };
  },

  computed: {
    selectedPreset: {
      get(): any {
        return this.internalValue.preset || {};
      },
      set(newVal: any) {
        this.internalValue = this.getValueForPreset(newVal);
      },
    },

    selectedOption: {
      set(newVal: CalendarOption) {
        this.selectedPreset = {
          period: this.selectedPreset.period || CalendarPeriod.Day,
          option: newVal,
        };
      },
      get(): string {
        return this.selectedPreset.option;
      },
    },

    selectedPeriod: {
      set(newVal: CalendarPeriod) {
        this.selectedPreset = {
          option: this.selectedPreset.option || CalendarOption.Current,
          period: newVal,
        };
      },
      get(): string {
        return this.selectedPreset.period;
      },
    },
  },

  watch: {
    value(val) {
      this.internalValue = val;
    },

    internalValue(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },
  },

  methods: {
    getValueForPreset(preset: IDateRangePreset): IDateRangeValue {
      const period = `${preset.period.toLowerCase()}` as unitOfTime.Base;
      switch (preset.option) {
        case CalendarOption.Previous:
          return {
            from: moment(this.today).subtract(1, period).startOf(period),
            to: moment(this.today).subtract(1, period).endOf(period),
            preset,
          };
        case CalendarOption.Current:
          return {
            from: moment(this.today).startOf(period),
            to: moment(this.today).endOf(period),
            preset,
          };
        case CalendarOption.Next:
          return {
            from: moment(this.today).add(1, period).startOf(period),
            to: moment(this.today).add(1, period).endOf(period),
            preset,
          };
        default:
          throw new Error('Expected option to be handled in switch');
      }
    },
  },
});
</script>
