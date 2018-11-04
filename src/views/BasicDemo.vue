<template>
  <div>
    <h2>Buttons</h2>

    <ui-button primary @click="onPrimary">Primary action</ui-button>&nbsp;
    <ui-button>Secondary action</ui-button>&nbsp;
    <ui-button primary inactive>Primary inactive</ui-button>&nbsp;
    <ui-button inactive>Secondary inactive</ui-button>&nbsp;


    <h3>Smaller version</h3>
    <ui-button small primary>Primary</ui-button>&nbsp;
    <ui-button small>Secondary</ui-button>

    <h2>Text field</h2>

    <div>
      <ui-text-field v-model="name" label="Project name" /> <span class="value"> {{ name }}</span>
    </div>

    <div>
      <ui-text-field v-model="number" phone label="Phone number" /> <span class="value"> {{ number }}</span>
    </div>

    <div>
      <ui-text-field label="Inactive Input" inactive />
    </div>

    <div>
      <ui-text-field label="Inactive Input" value="With text" inactive />
    </div>


    <!--
      TODO
      Generalize (combo box etc)
      Input types (number etc)
    -->

    <h2>Checkbox</h2>

    <div>
      <ui-checkbox v-model="checked">Checkbox</ui-checkbox>
    </div>
    <div>
      <ui-checkbox inactive>Inactive</ui-checkbox>
    </div>

    <h2>Radio buttons</h2>

    <label>
      <input type="radio" name="foo" value="1" />
      Foo 1
    </label>
    <input type="radio" name="foo" value="2">Foo 2</input>
    <input type="radio" name="bar" value="1">Bar 1</input>
    <input type="radio" name="bar" value="2">Bar 2</input>


    <h2>Select</h2>

    <ui-select v-model="country" :items="countries" label="Primary" primary />&nbsp;

    <ui-select v-model="country" :items="countries" label="Secondary" />

    <!--
      TODO
      Keyboard mapping
    -->

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiTextField from '@/components/UiTextField.vue';
import UiButton from '@/components/UiButton.vue';
import UiCheckbox from '@/components/UiCheckbox.vue';
import UiSelect from '@/components/UiSelect.vue';

export default Vue.extend({
  name: 'InputsDemo',

  components: {
    UiTextField,
    UiButton,
    UiCheckbox,
    UiSelect,
  },

  data() {
    return {
      checked: false,
      name: '',
      number: '',
      countries: [
        {title: 'Norge'},
        {title: 'Sverige'},
        {title: 'England'},
      ],
      country: null,
    };
  },

  methods: {
    onPrimary() {
      this.name += '!';
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../style/tools.scss';

.value {
  @include paragraph-font;
  color: $grayer;
}
</style>
