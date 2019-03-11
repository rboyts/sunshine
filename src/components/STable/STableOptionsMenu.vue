<template>
  <s-menu v-model="menuOpen" :class="classes({ open: menuOpen })">
    <template v-slot:activator>
      <a tabIndex="0"
        @keydown.enter.space.prevent="menuOpen = true"
        @keydown.escape="menuOpen = false"
        @blur="menuOpen = false"
      >
        <s-icon package="sunshine24" name="more" />
      </a>
    </template>

    <template v-slot:content>
      <s-menu-list>
        <s-list-item v-if="checkable" @click="onSelectAll">Velg alle</s-list-item>
        <s-list-item v-if="checkable" @click="onSelectNone">Velg ingen</s-list-item>
        <s-list-separator v-if="checkable" />
        <s-list-item>Eksporter til PDF</s-list-item>
        <s-list-item>Eksporter til Excel</s-list-item>
        <s-list-separator />
        <s-list-item
          v-for="(oc, i) in orderedColumns"
          :key="oc.column.key"
          checkable
          :inactive="i === 0"
          :checked="oc.visible"
          @change="onToggleColumn(i, $event)"
          @click="menuOpen = false"
        >
          {{ oc.column.title }}
        </s-list-item>
      </s-menu-list>
    </template>
  </s-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { ClassesMixin } from '../../lib/utils';
import SMenu from '../SMenu.vue';
import SListItem from '../SListItem.vue';
import SMenuList from '../SMenuList.vue';
import SListSeparator from '../SListSeparator.vue';

export default Vue.extend({
  name: 's-table-options-menu',

  mixins: [
    ClassesMixin,
  ],

  components: {
    SMenu,
    SMenuList,
    SListItem,
    SListSeparator,
  },

  props: {
    checkable: Boolean,
    orderedColumns: Array,
  },

  data() {
    return {
      menuOpen: false,
    };
  },

  methods: {
    onSelectAll() {
      this.menuOpen = false;
      this.$emit('selectAll');
    },

    onSelectNone() {
      this.menuOpen = false;
      this.$emit('selectNone');
    },

    onToggleColumn(index: number, checked: boolean) {
      this.$emit('toggleColumn', { index, checked });
    },
  },
});
</script>
