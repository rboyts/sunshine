<template>
  <s-format-input
    v-model="formattedValue"
    :format="format.toLowerCase()"
    :class="validState(formattedValue)"
    :input-class="{ 's-input__input': true, 's-input__input--with-label': !!label }"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import SFormatInput from '../internal/SFormatInput.vue';

export default Vue.extend({
  name: 'SDateToStringinput',

  components: {
    SFormatInput,
  },

  props: {
    value: {
      type: Object as () => Moment,
      default: undefined,
    },

    label: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      formattedValue: '',
      focus: false,

      // constants
      locale: moment.locale('nb'), // FIXME i18n
      format: moment.localeData().longDateFormat('L'),
    };
  },

  watch: {

    // TODO: Show format when date is null

    value: {
      handler(newVal) {
        if (!newVal) {
          this.formattedValue = '';
        } else {
          this.formattedValue = moment(newVal).format(this.format);
        }
      },
      immediate: true,
    },

    formattedValue(newVal) {
      if (this.validDate(this.formattedValue) &&
        this.formattedValue.length === this.format.length) {
        this.$emit('input', moment(this.formattedValue, this.format));
      } else if (this.formattedValue.length === 0) {
        this.$emit('input', null);
      }
    },
  },

  methods: {
    validState(value: string): string {
      if (value.length === Number(this.format.length)) {
        if (this.validDate(value)) {
          return '';

          // XXX This should only be used if somehow triggered by a validation action.
          // It looks very weird if the border is always green, if the date is valid.
          // return 's-input--valid';
        } else {
          return 's-input--error';
        }
      } else {
        return '';
      }
    },

    validDate(value: string): boolean {
      return moment(value, this.format).isValid();
    },
  },
});
</script>
