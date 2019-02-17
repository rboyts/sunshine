<template>
  <s-menu v-model="show">
    <s-button
      style="text-align: left; min-width: 150px"
      slot="activator"
      @keydown="onKeyPress"
      v-bind="$attrs"
      v-on="$listeners"
    >
      {{ text }}
      <template slot="right">
        <s-svg name="dropdownArrow" />
      </template>
    </s-button>
    <div slot="content">
      <ul class="s-select__list">
        <li v-for="item in items"
          class="s-select__list__item"
          :key="item.key"
          :class="{'s-select__list__item--selected': item === value}"
        >
          <a href="#" @click.prevent="onClick(item)">{{ item[labelKey] }}</a>
        </li>
      </ul>
    </div>
  </s-menu>
</template>


<script lang="ts">
import Vue from 'vue';
import SButton from './SButton.vue';
import SMenu from './SMenu.vue';
import SSvg from './internal/SSvg.vue';

export default Vue.extend({
  name: 's-select',
  inheritAttrs: false,

  components: {
    SButton,
    SMenu,
    SSvg,
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
