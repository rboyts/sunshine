<template>
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
</template>

<script lang="ts">
import Vue from 'vue';
import UiAccordion from '@/components/UiAccordion.vue';
import UiAccordionItem from '@/components/UiAccordionItem.vue';
import UiButton from '@/components/UiButton.vue';
import UiSelect from '@/components/UiSelect.vue';

export default Vue.extend({

  components: {
    UiAccordion,
    UiAccordionItem,
    UiButton,
    UiSelect,
  },

});
</script>
