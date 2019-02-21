<template>
  <s-menu v-model="isOpen">

    <!-- activator textField -->
    <template v-slot:activator>
      <s-text-field format="dd.mm.åååå" moment label="Dato" />
    </template>

    <!-- content datepicker -->
    <template v-slot:content>
      <s-datepicker />
    </template>

  </s-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import SMenu from './SMenu.vue';
import SDatepicker from './SDatepicker.vue';
import STextField from './STextField.vue';

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
    };
  },
});
</script>
