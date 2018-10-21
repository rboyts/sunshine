<template>
  <ui-menu v-model="show">
    <ui-button style="text-align: left; min-width: 150px" slot="activator" v-bind="$attrs" v-on="$listeners">
      {{ text }}
      <span slot="right">&#x2bc6;</span>
    </ui-button>
    <div slot="content">
      <ul class="select-list" style="white-space: nowrap">
        <li v-for="item in items" :key="item.key" class="select-item">
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
    items: [Array, Object],
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
  },

  methods: {
    onClick(item: any) {
      this.$emit('input', item);
      this.show = false;
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

  &:hover {
    background-color: #f1f1f1;
  }
}
</style>

