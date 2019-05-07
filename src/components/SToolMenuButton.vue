<template>
  <s-menu left>
    <template v-slot:activator>
      <s-button round>
        <s-icon
          package="sunshine24"
          :name="iconName"
        />
      </s-button>
    </template>

    <template v-slot:content="{ hide }">
      <s-menu-builder
        :items="items"
        @onClick="hide"
      />
    </template>
  </s-menu>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SToolMenuButton',

  props: {
    iconName: {
      type: String,
      default: 'more',
    },

    items: {
      type: Array,
      required: true,
    },
  },
});
</script>
