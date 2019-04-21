<template>
  <div class="s-date-field">
    <s-menu
      v-model="isOpen"
      :toggle-on-click="false"
    >
      <template v-slot:activator>
        <div
          class="s-date-field-single-input"
          @click="toggleOpen"
        >
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
          :include-menu="menu"
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
  name: 'SDateSingle',

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
    includeMenu: {
      type: Boolean,
      default: false,
    },
    value: {} as any,
    label: String,
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

  computed: {
    menu(): Boolean {
      return this.includeMenu;
    },
  },

  methods: {
    toggleOpen() {
      this.isOpen = true;
    },
  },
});
</script>
