<template>
  <SToolMenuButton
    icon-name="columns"
    :tooltip="tooltip"
    :items="items"
  />
</template>

<script>
import Vue from 'vue';
import SToolMenuButton from '../SToolMenuButton.vue';
import STableColumnsMixin from './STableColumnsMixin';

export default Vue.extend({
  name: 'STableColumnsMenu',

  mixins: [
    STableColumnsMixin,
  ],

  components: {
    SToolMenuButton,
  },

  props: {
    tooltip: {
      type: [String, Object],
      default: undefined,
    },
  },

  computed: {
    items() {
      return this.orderedColumns.map((c, index) => ({
        key: c.column.key,
        label: c.column.title,
        checkable: true,
        checked: c.visible,
        inactive: index === 0,
        onChange: checked => this.toggleColumn({ index, checked }),
      }));
    },
  },
});
</script>
