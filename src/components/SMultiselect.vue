<template>
  <div>
    <div class="flex">
      <s-text-field
        :class="$class('searchbar')"
        :placeholder="$t('s-multiselect.search')"
        v-model="filter"
      />
    </div>
    <div :class="$class('row')">
      <div :class="$class('title')">
        {{ leftLabel }}
      </div>
      <div />
      <div :class="$class('title')">
        {{ rightLabel }}
      </div>
    </div>
    <div :class="$class('row')">
      <s-list
        :class="$class('list')"
        :style="listStyle"
        :items="leftList"
        :filter="filter"
        v-model="leftChecked"
        @dblclick="onLeftDblClick"
      />
      <div
        class="flex-layout-down"
        :class="$class('button-container')"
      >
        <s-button
          square
          @click="moveToRight"
        >
          <s-icon
            name="arrow"
            package="sunshine24"
            :rotate="90"
          />
        </s-button>
        <s-button
          square
          @click="moveToLeft"
        >
          <s-icon
            name="arrow"
            package="sunshine24"
            :rotate="-90"
          />
        </s-button>
        <s-button
          square
          @click="moveAllToRight"
        >
          <s-icon
            name="double-arrow"
            package="sunshine24"
          />
        </s-button>
        <s-button
          square
          @click="moveAllToLeft"
        >
          <s-icon
            name="double-arrow"
            package="sunshine24"
            :rotate="-180"
          />
        </s-button>
      </div>
      <s-list
        :class="$class('list')"
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
  name: 'SMultiselect',

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
      default: '14rem',
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
      const items = this.leftChecked.map(
        key => this.leftList.find(i => key === i.key),
      );
      this.internalValue = [...items, ...this.internalValue];
      this.leftChecked = [];
    },

    moveAllToRight() {
      this.internalValue = [...this.internalValue, ...this.leftList];
      this.leftChecked = [];
    },

    moveToLeft() {
      this.internalValue = this.internalValue.filter(
        item => !this.rightChecked.includes(item.key),
      );
      this.rightChecked = [];
    },

    moveAllToLeft() {
      this.internalValue = [];
      this.rightChecked = [];
    },

    onLeftDblClick(item) {
      this.leftChecked = [item.key];
      this.moveToRight();
    },

    onRightDblClick(item) {
      this.rightChecked = [item.key];
      this.moveToLeft();
    },
  },
});
</script>
