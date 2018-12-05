<template>
  <div>
    <h2>Buttons</h2>

    <ui-button primary @click="text = 'Primary action'">Primary action</ui-button>&nbsp;
    <ui-button @click="text = 'Secondary action'">Secondary action</ui-button>&nbsp;
    <ui-button primary inactive>Primary inactive</ui-button>&nbsp;
    <ui-button inactive>Secondary inactive</ui-button>&nbsp;

    <p>
      <span class="value">{{ text }}</span>
    </p>


    <h3>Smaller version</h3>
    <ui-button small primary>Primary</ui-button>&nbsp;
    <ui-button small>Secondary</ui-button>

    <h2>Select</h2>

    <ui-select v-model="country" :items="countries" label="Primary" primary />&nbsp;

    <ui-select v-model="country" :items="countries" label="Secondary" />

    <!--
      TODO
      Keyboard mapping
    -->

    <h2>Text field</h2>

    <div>
      <ui-text-field v-model="name" label="Project name" /> <span class="value"> {{ name }}</span>
    </div>

    <div>
      <ui-text-field v-model="number" phone label="Phone number" /> <span class="value"> {{ number }}</span>
    </div>

    <div>
      <ui-text-field v-model="email" email label="Email" /> <span class="value"> {{ email }}</span>
    </div>

    <div>
      <ui-text-field v-model="password" password label="Password" /> <span class="value"> {{ password }}</span>
    </div>

    <div>
      <ui-text-field v-model="time" format="00:00" label="Expected format" /> <span class="value"> {{ time }}</span>
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

    <!-- Container group is needed -->

    <ui-radio-group v-model="option">
      <div>
        <ui-radio-button name="option" value="1">Option 1</ui-radio-button>
      </div>
      <div>
        <ui-radio-button name="option" value="2">Option 2</ui-radio-button>
      </div>
    </ui-radio-group>

    <p class="value">Selected: {{ option }}</p>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiTextField from '@/components/UiTextField.vue';
import UiButton from '@/components/UiButton.vue';
import UiCheckbox from '@/components/UiCheckbox.vue';
import UiSelect from '@/components/UiSelect.vue';
import UiRadioGroup from '@/components/UiRadioGroup.vue';
import UiRadioButton from '@/components/UiRadioButton.vue';

export default Vue.extend({
  name: 'InputsDemo',

  components: {
    UiTextField,
    UiButton,
    UiCheckbox,
    UiSelect,
    UiRadioGroup,
    UiRadioButton,
  },

  data() {
    return {
      checked: false,
      text: '-',
      name: '',
      number: '',
      email: '',
      password: '',
      time: '',
      countries: [
        {title: 'Norge'},
        {title: 'Sverige'},
        {title: 'England'},
      ],
      country: null,
      option: '1',
    };
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
