<template>
  <div>
    <ui-accordion>

      <ui-accordion-item>
        <template slot="heading">Basic settings</template>

        Basic settings here

        <p>
          <ui-button>Foo</ui-button>
        </p>
        <p>
          <ui-button>Foo</ui-button>
        </p>
        <p>
          <ui-button>Foo</ui-button>
        </p>
        <p>
          <ui-button>Foo</ui-button>
        </p>
        <p>
          <ui-button>Foo</ui-button>
        </p>
      </ui-accordion-item>

      <ui-accordion-item>
        <template slot="heading">Other settings</template>

        <template>
          <inner-component inline-template>
            <div>
              Other settings here
              <p>
                <ui-select>Bar</ui-select>
              </p>
            </div>
          </inner-component>
        </template>
      </ui-accordion-item>

      <ui-accordion-item>
        <template slot="heading">Comment</template>

        <div>
          <ui-text-field label="Project name" />
        </div>
      </ui-accordion-item>
    </ui-accordion>

    <p class="below">Some content below</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiAccordion from '@/components/UiAccordion.vue';
import UiAccordionItem from '@/components/UiAccordionItem.vue';
import UiButton from '@/components/UiButton.vue';
import UiSelect from '@/components/UiSelect.vue';
import UiTextField from '@/components/UiTextField.vue';

const InnerComponent = {
  name: 'inner-component',

  components: {
    UiSelect,
  },

  created() {
    console.log('inner component created');
  },

  mounted() {
    console.log('inner component mounted');
  },
};

export default Vue.extend({

  components: {
    UiAccordion,
    UiAccordionItem,
    UiButton,
    UiSelect,
    UiTextField,
    InnerComponent,
  },

});
</script>

<style lang="scss" scoped>
@import '../style/tools.scss';

.below {
  @include paragraph-font;
  color: $grayer;
}
</style>
