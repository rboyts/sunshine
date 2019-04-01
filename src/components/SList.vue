<!--
  Example: <s-list :items="items" v-model="selected" :filter="keyword" checkable/>

 items     - The items to show in the list
 v-model   - The items in the list that is selected/checked.
             If some items are to be preselected, they have to
             be added to items to be visible in the list
 filter    - Only show items containing the filter keyword
 checkable - Checkboxes beside all items.
-->

<template>
  <ul
    tabIndex="0"
    :class="classes()"
  >
    <s-list-item
      v-for="item in visibleItems"
      :key="item.key"
      :checkable="checkable"
      :checked="isChecked(item)"
      :selected="isSelected(item)"
      @click.exact="itemClicked(item)"
      @click.ctrl.exact="itemCtrlClicked(item)"
      @click.shift.exact="itemShiftClicked(item)"
      @dblclick.native.exact="itemDblClicked(item)"
      @change="itemClicked(item)"
    >
      {{ item.label }}
    </s-list-item>
  </ul>
</template>

<script>
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import { ClassesMixin } from '../lib/utils';
import SListItem from './SListItem.vue';

export default mixins(ClassesMixin).extend({
  name: 's-list',

  components: {
    SListItem,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    value: {
      type: Array,
      default: () => [],
    },

    checkable: {
      type: Boolean,
      default: false,
    },

    filter: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      selection: [],
    };
  },

  // 1. Is it worth it performance-wise to keep only the keys in the selection array?
  // I assume we want to emit the key label pairs.
  //
  // In selection we then have to do something like this:
  // const items = this.items.filter(i => this.selection.includes(i.key));
  // this.$emit('input', items)
  //
  // And in value (The user can put preselected items here):
  // this.selection = val.map(i => i.key);
  //
  // In the value watch, we should only assign selection = val if val is not equal this.value,
  // since we're creating new arrays this would require a deep array comparison?
  //
  // 2. Should value and selection watch have the deep: true option, in case data is changed?
  // 3. Are props watched deep?
  //

  watch: {
    value: {
      handler(val) {
        this.selection = val;
      },
      immediate: true,
    },

    selection(val) {
      this.$emit('input', val);
    },
  },

  computed: {
    visibleItems() {
      return this.items.filter(i => i.label.toLowerCase().includes(this.filter.toLowerCase()));
    },
  },

  methods: {
    isSelected(item) {
      if (this.checkable) return false;
      return this.selection.map(i => i.key).includes(item.key);
    },

    isChecked(item) {
      if (!this.checkable) return false;
      return this.selection.map(i => i.key).includes(item.key);
    },

    itemClicked(item, index) {
      if (this.checkable) {
        this.itemCtrlClicked(item);
        return;
      }
      if (this.selection.map(i => i.key).includes(item.key)) {
        this.selection = [];
      } else {
        this.selection = [item];
      }
    },

    itemCtrlClicked(item, index) {
      if (this.selection.map(i => i.key).includes(item.key)) {
        this.selection = this.selection.filter(i => i.key !== item.key);
      } else {
        this.selection = this.selection.concat(item);
      }
    },

    itemShiftClicked(item, index) {
      // implement
    },

    itemDblClicked(item) {
      this.$emit('dblclick', item);
    },
  },
});

</script>
