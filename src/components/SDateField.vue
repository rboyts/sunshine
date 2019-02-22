<template>
  <div class="s-date-field">
    <s-menu v-model="isOpen">

      <!-- activator textField -->
      <template v-slot:activator>
        <s-text-field
          v-model="input"
          format="dd.mm.åååå"
          :dateLocale="locale"
          :dateFormat="format"
          moment
          label="Dato"
          @input="onInput"
        />
      </template>

      <!-- content datepicker -->
      <template v-slot:content>
        <!--
          Add props: range: false,
          ++?
        -->
        <s-datepicker

          :locale="locale"
          :format="format"
          v-model="input" />
      </template>

    </s-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment, { Moment } from 'moment';
import SMenu from './SMenu.vue';
import SDatepicker from './SDatepicker.vue';
import STextField from './STextField.vue';

moment.locale('nb');

export default Vue.extend({
  name: 's-date-field',

  components: {
    SMenu,
    SDatepicker,
    STextField,
  },

  data() {
    return {
      isOpen: false,
      input: '',
      locale: moment.locale(),
      format: moment.localeData().longDateFormat('L'),
    };
  },

  methods: {
    onInput(input: string) {
      console.log(input);
      console.log(this.format);
      this.input = input;
    },
  },
});
</script>
