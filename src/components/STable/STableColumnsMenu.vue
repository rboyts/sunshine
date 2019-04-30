<template>
  <s-menu left>
    <template v-slot:activator>
      <s-button round>
        <s-icon
          package="sunshine24"
          name="columns"
        />
      </s-button>
    </template>

    <template v-slot:content>
      <s-menu-list>
        <s-list-item
          v-for="(oc, i) in orderedColumns"
          :key="oc.column.key"
          checkable
          :inactive="i === 0"
          :checked="oc.visible"
          @change="toggleColumn({ index: i, changed: $event })"
        >
          {{ oc.column.title }}
        </s-list-item>
      </s-menu-list>
    </template>
  </s-menu>
</template>

<script>
import Vue from 'vue';
import SMenu from '../SMenu.vue';
import SListItem from '../SListItem.vue';
import SMenuList from '../SMenuList.vue';
import STableColumnsMixin from './STableColumnsMixin';

export default Vue.extend({
  name: 'STableColumnsMenu',

  mixins: [
    STableColumnsMixin,
  ],

  components: {
    SMenu,
    SMenuList,
    SListItem,
  },
});
</script>
