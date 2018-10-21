<template>
  <div>
    <h1>Inputs demo</h1>

    <h2>Text field</h2>

    <ui-input label="Project name" />
    <ui-input label="Phone number" />

    <!--
      TODO
      Model binding
      Generalize (combo box etc)
      Input types (number etc)
    -->

    <h2>Checkbox</h2>
    <ui-checkbox v-model="checked">{{ checked }}</ui-checkbox>

    <!--
      TODO
      Styling
      Radio button
    -->

    <h2>Select</h2>
    <ui-select v-model="country" :items="countries" label="Columns" />

    <!--
      TODO
      Keyboard mapping
      Inline label
    -->

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiInput from '@/components/UiInput.vue';
import UiButton from '@/components/UiButton.vue';
import UiCheckbox from '@/components/UiCheckbox.vue';
import UiSelect from '@/components/UiSelect.vue';

export default Vue.extend({
  name: 'InputsDemo',

  components: {
    UiInput,
    UiButton,
    UiCheckbox,
    UiSelect,
  },

  data() {
    return {
      checked: false,
      countries: [
        {title: 'Norge'},
        {title: 'Sverige'},
        {title: 'England'},
      ],
      country: null,
    };
  },
});
</script>
