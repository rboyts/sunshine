<template>
  <div>
    <h1>Basic components demo</h1>

    <h2>Buttons</h2>

    <ui-button>Primary action</ui-button>&nbsp;
    <ui-button secondary>Secondary action</ui-button>&nbsp;
    <ui-button inactive>Primary inactive</ui-button>&nbsp;
    <ui-button secondary inactive>Secondary inactive</ui-button>&nbsp;


    <h3>Smaller version</h3>
    <ui-button small>Primary</ui-button>&nbsp;
    <ui-button small secondary>Secondary</ui-button>

    <h2>Text field</h2>

    <div>
      <ui-input v-model="name" label="Project name" /> <span class="value"> {{ name }}</span>
    </div>

    <div>
      <ui-input v-model="number" phone label="Phone number" /> <span class="value"> {{ number }}</span>
    </div>

    <div>
      <ui-input label="Inactive Input" inactive />
    </div>

    <div>
      <ui-input label="Inactive Input" value="With text" inactive />
    </div>


    <!--
      TODO
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

    <ui-select v-model="country" :items="countries" label="Primary" />&nbsp;

    <ui-select secondary v-model="country" :items="countries" label="Secondary" />

    <!--
      TODO
      Keyboard mapping
    -->

    <h2>Accordion</h2>

    <ui-accordion>

      <ui-accordion-item>
        <template slot="heading">Basic settings</template>

        Basic settings here

        <p>
          <ui-button>Foo</ui-button>
        </p>
      </ui-accordion-item>

      <ui-accordion-item>
        <template slot="heading">Other settings</template>

        Other settings here
        <p>
          <ui-select>Bar</ui-select>
        </p>
      </ui-accordion-item>

    </ui-accordion>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiInput from '@/components/UiInput.vue';
import UiButton from '@/components/UiButton.vue';
import UiCheckbox from '@/components/UiCheckbox.vue';
import UiSelect from '@/components/UiSelect.vue';
import UiAccordion from '@/components/UiAccordion.vue';
import UiAccordionItem from '@/components/UiAccordionItem.vue';

export default Vue.extend({
  name: 'InputsDemo',

  components: {
    UiInput,
    UiButton,
    UiCheckbox,
    UiSelect,
    UiAccordion,
    UiAccordionItem,
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
});
</script>

<style lang="scss" scoped>
@import '../style/tools.scss';

.value {
  @include paragraph-font;
  color: $grayer;
}
</style>
