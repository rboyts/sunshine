<!--

    Example:  <s-multiselect :items="items" v-model="selected"/>

    items: The items to be shown in the left list
    v-model: the items to be shown i the right list
    leftLabel: Lable over the left list
    rightLabel: Lable over the left list
    height: The height of the component
-->

<template>
  <div>
    <div class="flex">
      <s-text-field
        class="s-multiselect__searchbar"
        placeholder="Søk.."
        v-model="filter"
      />
    </div>
    <div class="s-multiselect__row">
      <div class="s-multiselect__title">
        {{ leftLabel }}
      </div>
      <div></div>
      <div class ="s-multiselect__title">
        {{ rightLabel }}
      </div>
    </div>
    <div class="s-multiselect__row">
      <s-list
        class="s-list__container"
        :style="listStyle"
        :items="leftList"
        :filter="filter"
        v-model="leftChecked"
        @dblclick="onLeftDblClick"
      />
      <div class="flex-layout-down s-multiselect__button-container">
        <s-button small @click="moveToRight">&gt;</s-button>
        <s-button small @click="moveToLeft">&lt;</s-button>
        <s-button small @click="moveAllToLeft">&lt;&lt;</s-button>
        <s-button small @click="moveAllToRight">&gt;&gt;</s-button>
      </div>
      <s-list
        class="s-list__container"
        :style="listStyle"
        :filter="filter"
        :items="internalValue"
        v-model="rightChecked"
        @dblclick="onRightDblClick"
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
  name: 's-multiselect',

  components: {
    SList,
    SButton,
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

    leftLabel: {
      type: String,
      default: '',
    },

    rightLabel: {
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
      internalValue: [],
      leftChecked: [],
      rightChecked: [],
      filter: '',
    };
  },

  watch: {
    value: {
      handler(items) {
        this.internalValue = items;
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
    leftList() {
      return this.items.filter(i => !this.isSelected(i));
    },

    listStyle() {
      return {
        height: this.height,
      };
    },
  },

  methods: {
    isSelected(item) {
      return this.internalValue.map(i => i.key).includes(item.key);
    },

    moveToRight() {
      this.internalValue = [...this.leftChecked, ...this.internalValue];
      this.leftChecked = [];
    },

    moveAllToRight() {
      this.internalValue = [...this.leftList];
      this.leftChecked = [];
    },

    moveToLeft() {
      this.internalValue = this.internalValue.filter(
        item => !this.rightChecked.map(i => i.key).includes(item.key),
      );
      this.rightChecked = [];
    },

    moveAllToLeft() {
      this.internalValue = [];
      this.rightChecked = [];
    },

    onLeftDblClick(item) {
      this.leftChecked = [item];
      this.moveToRight();
    },

    onRightDblClick(item) {
      this.rightChecked = [item];
      this.moveToLeft();
    },
  },
});
</script>
