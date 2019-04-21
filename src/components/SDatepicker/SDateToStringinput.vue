<template>
  <s-text-field
    moment
    v-model="formattedValue"
    :format="format.toLowerCase()"
    :date-locale="locale"
    :date-format="format"
    :label="label"
    :class="validState(formattedValue)"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import STextField from '../STextField.vue';

// TODO: Hide format when filter is displayed in input

export default Vue.extend({
  name: 'SDateToStringinput',

  components: {
    STextField,
  },

  data() {
    return {
      formattedValue: '',
      validStyle: 's-input--valid',
      errorStyle: 's-input--error',
      focus: false,
    };
  },

  props: {
    value: {} as () => Moment,
    format: String,
    locale: String,
    label: String,
    filter: String,
  },

  watch: {

    // TODO: Show format when date is null
    // TODO: Remove filter when user inputs dates

    value(newVal) {
      if (!newVal) {
        this.formattedValue = '';
      } else {
        this.formattedValue = moment(newVal).format(this.format);
      }
    },

    formattedValue(newVal) {
      if (this.filter) {
        this.formattedValue = this.filter;
      } else {
        this.formattedValue = this.formatValue(newVal);
      }
      if (this.validDate(this.formattedValue) &&
        this.formattedValue.length === this.format.length) {
        this.$emit('input', moment(this.formattedValue, this.format));
      } else if (this.formattedValue.length === 0) {
        this.$emit('input', null);
      }
    },
  },

  computed: {
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

  methods: {
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
  },

  mounted() {
    // TODO: if valid and not null
    this.formattedValue = moment(this.value).format(this.format);
  },
});
</script>
