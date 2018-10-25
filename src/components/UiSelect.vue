<template>
  <ui-menu
    v-model="show"
  >
    <ui-button
      style="text-align: left; min-width: 150px"
      slot="activator"
      @keydown="onKeyPress"
      v-bind="$attrs"
      v-on="$listeners"
    >
      {{ text }}
      <span slot="right">&#x2bc6;</span>
    </ui-button>
    <div slot="content">
      <ul class="select-list" style="white-space: nowrap">
        <li v-for="item in items"
          class="select-item"
          :key="item.key"
          :class="{'select-item-selected': item === value}"
        >
          <a href="#" @click.prevent="onClick(item)">{{ item[labelKey] }}</a>
        </li>
      </ul>
    </div>
  </ui-menu>
</template>


<script lang="ts">
import Vue from 'vue';
import UiButton from './UiButton.vue';
import UiMenu from './UiMenu.vue';

export default Vue.extend({
  name: 'ui-select',
  inheritAttrs: false,

  components: {
    UiButton,
    UiMenu,
  },

  props: {
    items: Array as () => any[],
    value: Object,
    labelKey: {
      type: String,
      default: 'title',
    },
    label: {
      type: String,
      default: 'Select',
    },
  },

  data() {
    return {
      show: false,
    };
  },

  computed: {
    text(): string {
      return this.value ? this.value[this.labelKey] : this.label;
    },

    currentIndex(): number {
      return this.items.indexOf(this.value);
    },
  },

  methods: {
    onClick(item: any) {
      this.setSelectedItem(item);
      this.show = false;
    },

    setSelectedItem(item: any) {
      this.$emit('input', item);
    },

    setNextSelected() {
      if (this.currentIndex < this.items.length - 1)
        this.setSelectedItem(this.items[this.currentIndex + 1]);
    },

    setPrevSelected() {
      if (this.currentIndex > 0)
        this.setSelectedItem(this.items[this.currentIndex - 1]);
    },

    onKeyPress(event: KeyboardEvent) {
      console.log(event.key);
      let consumed = false;
      switch (event.key) {
        case 'ArrowDown':
          this.setNextSelected();
          break;
        case 'ArrowUp':
          this.setPrevSelected();
          break;
      }
      return true;
    },
  },
});
</script>

<style lang="scss" scoped>
$item-height: 32px;

.select-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.select-item > a {
  display: block;
  padding: 0 8px;
  height: $item-height;
  line-height: $item-height;

  text-decoration: none;
  color: #111;
}

.select-item > a:hover,
.select-item-selected > a {
  background-color: #e8e8e8;
}
</style>

