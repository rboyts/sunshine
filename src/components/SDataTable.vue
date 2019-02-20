<template>
  <div class="flex-column flex-grow">
    <data-table-internal
      class="flex-grow"
      :items="items"
      :total="total"
      :skip="skip"
      :sorting="sorting"
      :columns="visibleColumns"
      @sort="onSort"
      @visible-rows="onVisibleRows"
      @move-column="onMoveColumn"
      @open-item="onOpenItem"

      v-bind="$attrs"
    >

      <template slot="menu">
        <s-menu v-model="menuOpen">
          <div slot="activator" :class="classes('more', {open: menuOpen})">
            <s-icon package="sunshine24" name="more" />
          </div>

          <template slot="content">
            <s-list>
              <s-list-item
                v-for="(oc, i) in orderedColumns"
                :key="oc.column.key"
                checkable
                :inactive="i === 0"
                :checked="oc.visible"
                @change="onToggleColumn(i, $event)"
              >
                {{ oc.column.title }}
              </s-list-item>
            </s-list>
          </template>
        </s-menu>
      </template>

      <!-- Pass on all named slots -->
      <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>

      <!-- Pass on all scoped slots -->
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>

    </data-table-internal>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';
import SMenu from './SMenu.vue';
import SButton from './SButton.vue';
import SList from './SList.vue';
import SListItem from './SListItem.vue';
import SIcon from './SIcon.vue';
import DataTableInternal from './internal/DataTableInternal';
import {
  ISortState, IItem, IColumn, IRequestLoadItemsPayload, IOrderedColumn, IColumns,
} from './types';

export { IColumn, ISortState, IItem } from './types';


export default mixins(ClassesMixin).extend({
  name: 's-data-table',
  inheritAttrs: false,

  components: {
    SMenu,
    SButton,
    SList,
    SListItem,
    SIcon,
    DataTableInternal,
  },

  props: {
    module: String,
  },

  data() {
    return {
      menuOpen: false,
    };
  },

  computed: {
    visibleColumns(): IColumn[] {
      return this.getState('visibleColumns');
    },

    orderedColumns(): IOrderedColumn[] {
      return this.getState('orderedColumns');
    },

    columns(): IColumn[] {
      return this.getState('columns');
    },

    items(): IItem[] {
      return this.getState('items');
    },

    skip(): number {
      return this.getState('skip');
    },

    total(): number {
      return this.getState('total');
    },

    sorting(): ISortState {
      return this.getState('sorting');
    },
  },

  watch: {
    module: {
      handler() {
        this.tryDispatchAction('init');
      },
      immediate: true,
    },
  },

  methods: {
    getState(key: string): any {
      return this.$store.getters[`${this.module}/${key}`];
    },

    tryDispatchAction(name: string, payload?: any): boolean {
      if (!this.module) return false;
      this.$store.dispatch(`${this.module}/${name}`, payload);
      return true;
    },

    onVisibleRows(args: IRequestLoadItemsPayload) {
      this.tryDispatchAction('requestLoadItems', args);
    },

    onOpenItem(keyPath: string) {
      this.tryDispatchAction('requestLoadSubItems', { keyPath });
    },

    onSort(event: MouseEvent, key: string) {
      this.tryDispatchAction('sort', key);
    },

    onMoveColumn({ from, to }: {from: number, to: number}) {
      this.tryDispatchAction('moveColumn', { from, to });
    },

    onToggleColumn(index: number, checked: boolean) {
      this.tryDispatchAction('toggleColumn', { index, checked });
    },
  },
});
</script>
