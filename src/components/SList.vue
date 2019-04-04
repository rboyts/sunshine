<!--
  Example: <s-list :items="items" v-model="selected" :filter="keyword" checkable/>

 items     - The items to show in the list
 v-model   - The items in the list that is selected/checked.
             If some items are to be preselected, they have to
             be added to items to be visible in the list
 filter    - Only show items containing the filter keyword
-->

<template>
  <ul
    tabIndex="0"
    :class="classes()"
  >
    <s-list-item
      v-for="item in visibleItems"
      :key="item.key"
      :selected="isSelected(item)"
      @click.exact="onItemClick($event, item)"
      @click.ctrl.exact="onItemCtrlClick(item)"
      @click.shift.exact="onItemShiftClick(item)"
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
      required: true,
    },

    value: {
      type: Array,
      required: true,
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
      internalValue: [],
    };
  },

  watch: {
    value: {
      handler(val) {
        this.internalValue = val;
      },
      immediate: true,
    },

    internalValue(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },
  },

  computed: {
    visibleItems() {
      const filter = this.filter.toLowerCase();
      return this.items.filter(i => i.label.toLowerCase().includes(filter));
    },
  },

  methods: {
    isSelected(item) {
      return this.internalValue.map(i => i.key).includes(item.key);
    },

    onItemClick(event, item) {
      if (event.detail > 1) {
        this.$emit('dblclick', item);
      } else {
        this.internalValue = this.isSelected(item) ? [] : [item];
      }
    },

    onItemCtrlClick(item) {
      this.internalValue = this.isSelected(item) ?
        this.internalValue.filter(i => i.key !== item.key) :
        this.internalValue.concat(item);
    },

    onItemShiftClick(item) {
      // implement
    },
  },
});

</script>
