<template>
  <s-menu
    left
    v-model="active"
  >
    <template v-slot:activator>
      <s-button
        :class="$class({ active })"
        round
      >
        <s-icon
          package="sunshine24"
          :name="iconName"
        />
      </s-button>
    </template>

    <template v-slot:content="{ hide }">
      <s-menu-builder
        :items="items"
        @onClick="dismiss ? hide() : ''"
      />
    </template>
  </s-menu>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SToolMenuButton',

  data() {
    return {
      active: false,
    };
  },

  props: {
    iconName: {
      type: String,
      default: 'more',
    },

    items: {
      type: Array,
      required: true,
    },

    dismiss: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
