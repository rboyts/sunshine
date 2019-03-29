<!--
  Example: <s-list :items="items" v-model="selected" :filter="keyword" checkable/>

  Currently if user adds items to the 'selected' array attached to v-model,
  the items won't be added to the 'items' list. Should this be default behaviour?

  @keydown.down="nextItem"
    @keydown.up="prevItem"
    @keydown.space="onSpace"

    class -> 's-list-item--active': index === curIndex && hasFocus


    @focus="hasFocus = true"
    @blur="hasFocus = false"

    filter til småbokstaver

-->

<template>
  <ul
    ref="list"
    tabIndex="0"
    :class="classes()"
  >
    <s-list-item
      v-for="(item, index) in visibleItems"
      :key="item.key"
      :class="{ 's-list-item--separator': true }"
      :checkable="checkable"
      :checked="isSelected(item)"
      :selected="isSelected(item)"
      @click="itemClicked(item, index)"
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

const activeItemClass = 's-list-item--active';

export default mixins(ClassesMixin).extend({
  name: 's-list',

  components: {
    SListItem,
  },

  model: {
    prop: 'selected',
    event: 'selected',
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    selected: {
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
      curIndex: 0,
      hasFocus: false,
    };
  },

  watch: {
    selected: {
      handler(val) {
        if (val) {
          this.selection = val;
        }
      },
      immediate: true,
    },

    selection: {
      handler(val) {
        if (val !== this.selected) {
          this.$emit('selected', val);
        }
      },
    },
  },

  computed: {
    visibleItems() {
      return this.items.filter(i => i.label.includes(this.filter));
    },
  },

  methods: {
    isSelected(item) {
      return this.selection.map(i => i.key).includes(item.key);
    },

    itemClicked(item, index) {
      if (this.selection.map(i => i.key).includes(item.key)) {
        this.selection = this.selection.filter(i => i.key !== item.key);
      } else {
        this.selection = this.selection.concat(item);
      }
    },

    nextItem() {
      if (this.curIndex < this.visibleItems.length - 1) {
        this.curIndex++;
      }
    //  this.ensureItemVisible();
    },

    prevItem() {
      if (this.curIndex > 0) {
        this.curIndex--;
      }
   //   this.ensureItemVisible();
    },

    onSpace() {
      const item = this.visibleItems[this.curIndex];
      this.itemClicked(item);
    },

    ensureItemVisible() {
      const { list } = this.$refs;
      const item = list.querySelector(`.${activeItemClass}`);
      if (item.offsetTop < list.scrollTop) {
        item.scrollIntoView(true);
      } else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.offsetHeight) {
        item.scrollIntoView(false);
      }
    },

  },
});

</script>
