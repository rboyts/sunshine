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
          <s-date-to-stringinput
            v-model="internalValue"
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
    };
  },

  props: {
    value: {
      type: Object as () => Moment,
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
