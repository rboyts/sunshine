<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen" :toggleOnClick="false">
      <template v-slot:activator>
        <div class="s-date-field-range-input" @click="toggleOpen">
          <s-date-to-stringinput
            v-model="internalValue.from"
            :locale="locale"
            :label="fromLabel"
            :format="format"
          />
          <s-date-to-stringinput
            v-model="internalValue.to"
            :locale="locale"
            :label="toLabel"
            :format="format"
          />
        </div>
      </template>
      <template v-slot:content>
        <s-datepicker
          rangeSelect
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
import SDatepicker from './SDatepicker.vue';
import SDateToStringinput from './SDateToStringinput.vue';

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
      internalValue: this.value,
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
    };
  },

  props: {
    value: {} as any,
    fromLabel: String,
    toLabel: String,
  },

  computed: {

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
  },

  methods: {
    toggleOpen() {
      this.isOpen = true;
    },
  },
});
</script>
