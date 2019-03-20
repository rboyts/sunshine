<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen" :toggleOnClick="false">
      <template v-slot:activator>
        <div class="s-date-field-single-input" @click="toggleOpen">
          <s-date-to-stringinput
            v-model="internalValue"
            :locale="locale"
            :label="label"
            :format="format"
          />
        </div>
      </template>
      <template v-slot:content>
        <s-datepicker
          :locale="locale"
          :format="format"
          v-model="internalValue"
        />
      </template>
    </s-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import SMenu from '../SMenu.vue';
import SDatepicker from '../SDatepicker.vue';
import SDateToStringinput from './SDateToStringinput.vue';

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
      internalValue: this.value,
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
    };
  },

  props: {
    value: {} as any,
    label: String,
  },

  watch: {
    value(newVal) {
      this.internalValue = newVal;
    },

    internalValue(newVal, oldVal) {
      if (moment(newVal, this.format).isValid()) {
        this.$emit('input', newVal);
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
