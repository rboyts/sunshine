<template>
  <s-menu
    v-model="menuOpen"
    :class="classes({ open: menuOpen })"
  >
    <template v-slot:activator>
      <a
        tabIndex="0"
        @keydown.enter.space.prevent="menuOpen = true"
        @keydown.escape="menuOpen = false"
        @blur="menuOpen = false"
      >
        <s-icon
          package="sunshine24"
          name="more"
        />
      </a>
    </template>

    <template v-slot:content>
      <s-menu-list>
        <s-list-item @click="onSelectAll">
          {{ $t('s-table.select-all') }}
        </s-list-item>
        <s-list-item @click="onSelectNone">
          {{ $t('s-table.select-none') }}
        </s-list-item>
        <s-list-separator />
        <s-list-item>{{ $t('s-table.export-pdf') }}</s-list-item>
        <s-list-item>{{ $t('s-table.export-excel') }}</s-list-item>
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

<script>
import Vue from 'vue';
import ClassesMixin from '../internal/ClassesMixin';
import SMenu from '../SMenu.vue';
import SListItem from '../SListItem.vue';
import SMenuList from '../SMenuList.vue';
import SListSeparator from '../SListSeparator.vue';

export default Vue.extend({
  name: 'STableOptionsMenu',

  mixins: [
    ClassesMixin,
  ],

  i18n: {
    messages: {
      en: {
        's-table': {
          'select-all': 'Select all',
          'select-none': 'Select none',
          'export-pdf': 'Export as PDF',
          'export-excel': 'Export to Excel',
        },
      },

      nb: {
        's-table': {
          'select-all': 'Velg alle',
          'select-none': 'Velg ingen',
          'export-pdf': 'Eksporter som PDF',
          'export-excel': 'Eksporter til Excel',
        },
      },

      sv: {
        's-table': {
          'select-all': 'Markera alla',
          'select-none': 'Markera ingen',
          'export-pdf': 'Exportera som PDF',
          'export-excel': 'Exportera till Excel',
        },
      },
    },
  },

  components: {
    SMenu,
    SMenuList,
    SListItem,
    SListSeparator,
  },

  props: {
    orderedColumns: {
      type: Array,
      required: true,
    },
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

    onToggleColumn(index, checked) {
      this.$emit('toggleColumn', { index, checked });
    },
  },
});
</script>
