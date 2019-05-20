<template>
  <div class="s-date-field">
    <s-menu
      v-model="isOpen"
      :toggle-on-click="false"
    >
      <template v-slot:activator>
        <s-base-input
          class="s-date-field-single-input"
          :label="label"
          :is-empty="false"
          @click="toggleOpen"
        >
          <s-date-input
            v-model="internalDate"
            :label="label"
          />
        </s-base-input>
      </template>
      <template v-slot:content>
        <s-datepicker
          v-model="internalValue"
        />
      </template>
    </s-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DateTime } from 'luxon';
import SMenu from '../SMenu.vue';
import { IDatepickerValue } from '../types';
import SDatepicker from './SDatepicker.vue';
import SDateInput from './SDateInput.vue';

export default Vue.extend({
  name: 'SDateSingle',

  components: {
    SMenu,
    SDateInput,
    SDatepicker,
  },

  data() {
    return {
      isOpen: false,
      internalDate: undefined as DateTime | undefined,
      internalValue: this.value,
    };
  },

  props: {
    value: {
      type: Object as () => IDatepickerValue,
      default: undefined,
    },

    label: {
      type: String,
      default: undefined,
    },
  },

  watch: {
    value(newVal) {
      this.internalValue = newVal;
    },

    internalValue(val: IDatepickerValue) {
      if (val && val.date && val.date.isValid) {
        this.internalDate = val.date;
      }
    },

    internalDate(val) {
      if (val && val.isValid) {
        this.internalValue = {
          date: val,
        };
      }
    },

    isOpen(newVal) {
      if (!newVal) {
        this.$emit('input', this.internalValue);
      }
    },
  },

  methods: {
    toggleOpen() {
      this.isOpen = true;
    },
  },
});
</script>
