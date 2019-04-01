<!--

    Example:  <s-multiselect :items="items" v-model="selected"/>

    items: The items to be shown in the left list
    v-model: the items to be shown i the right list
    checkable: checboxes beside each item
    leftlabel: Lable over the right list
    leftfilter: Filter for the left list
    rightfilter: Filter for the right list
    height: The height of the component
-->

<template>
  <div>
    <div class="s-multiselector__row">
         <div class="s-multiselector__title">
            {{ leftlabel }}
        </div>
        <div />
        <div class ="s-multiselector__title">
            {{ rightlabel }}
        </div>
    </div>
    <div class="s-multiselector__row">
      <s-list
        class="s-list__container"
        :style="listStyle"
        :items="leftList"
        :filter="leftfilter"
        :checkable="checkable"
        v-model="leftChecked"
        @dblclick="leftDblClick"
      />
      <div class="flex-layout-down s-multiselector__button-container">
        <s-button small @click="moveToRight">&gt;</s-button>
        <s-button small @click="moveToLeft">&lt;</s-button>
        <s-button small @click="moveAllToLeft">&lt;&lt;</s-button>
         <s-button small @click="moveAllToRight">&gt;&gt;</s-button>
      </div>
      <s-list
        class="s-list__container"
        :style="listStyle"
        :filter="rightfilter"
        :items="rightList"
        :checkable="checkable"
        v-model="rightChecked"
        @dblclick="rightDblClick"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SListItem from './SListItem.vue';
import SList from './SList.vue';
import SButton from './SButton.vue';

export default Vue.extend({
  name: 's-multiselector',

  components: {
    SList,
    SButton,
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

    leftlabel: {
      type: String,
      default: '',
    },

    rightlabel: {
      type: String,
      default: '',
    },

    leftfilter: {
      type: String,
      default: '',
    },

    rightfilter: {
      type: String,
      default: '',
    },

    height: {
      type: String,
      default: '12em',
    },
  },

  data() {
    return {
      leftList: this.items,
      rightList: this.selected,
      leftChecked: [],
      rightChecked: [],
    };
  },

  watch: {
    items(items) {
      if (items !== this.items) {
        this.leftList = items;
      }
    },

    value: {
      handler(items) {
        if (items !== this.rightList) {
          this.rightList = items;
        }
      },
      immediate: true,
    },
  },

  computed: {
    listStyle() {
      return {
        height: this.height,
      };
    },
  },

  methods: {
    unselect(items) {
      this.$emit('input', items);
    },

    moveToRight() {
      this.rightList.unshift(...this.leftChecked);
      this.leftList = this.leftList.filter(
        item => !this.leftChecked.map(i => i.key).includes(item.key),
      );
      this.leftChecked = [];
    },

    moveAllToRight() {
      this.rightList.unshift(...this.leftList);
      this.leftList = [];
      this.leftChecked = [];
    },

    moveToLeft() {
      this.leftList.unshift(...this.rightChecked);
      this.rightList = this.rightList.filter(
        item => !this.rightChecked.map(i => i.key).includes(item.key),
      );
      this.rightChecked = [];
      this.unselect(this.rightList);
    },

    moveAllToLeft() {
      this.leftList.unshift(...this.rightList);
      this.rightList = [];
      this.rightChecked = [];
      this.unselect(this.rightList);
    },

    leftDblClick(item) {
      if (this.checkable) return;
      this.leftChecked = [];
      this.leftChecked.unshift(item);
      this.moveToRight();
    },

    rightDblClick(item) {
      if (this.checkable) return;
      this.rightChecked = [];
      this.rightChecked.unshift(item);
      this.moveToLeft();
    },
  },
});
</script>
