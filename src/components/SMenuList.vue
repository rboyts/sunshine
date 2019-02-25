<template>
  <div
    @mouseover="onMouseOver"
    @mousedown="$event.preventDefault()"
  >
    <s-list>
      <global-events
        @keydown.capture.down.prevent="selectNext"
        @keydown.capture.up.prevent="selectPrevious"
        @keydown.capture.enter.prevent.stop="activate"
        @keydown.capture.space.prevent.stop="activate"
      />

      <slot />
    </s-list>
  </div>
</template>

<script>
import Vue from 'vue';
import GlobalEvents from 'vue-global-events';
import SList from './SList.vue';

const itemClass = 's-list-item';
const selectedItemClass = 's-list-item--selected';

export default Vue.extend({
  name: 's-menu-list',

  components: {
    SList,
    GlobalEvents,
  },

  methods: {
    getSelectedItem() {
      return this.$el.querySelector(`.${selectedItemClass}`);
    },

    getItems() {
      return Array.from(this.$el.querySelectorAll(`.${itemClass}`));
    },

    activate() {
      const selected = this.getSelectedItem();
      if (selected) {
        selected.click();
      }
    },

    setSelected(next, prev) {
      if (!next) return;
      if (prev) {
        prev.classList.remove(selectedItemClass);
      }
      next.classList.add(selectedItemClass);
    },

    selectPrevious() {
      const items = this.getItems();
      const selected = this.getSelectedItem();
      const index = selected ? items.indexOf(selected) : items.length;
      this.setSelected(items[index - 1], selected);
    },

    selectNext() {
      const items = this.getItems();
      const selected = this.getSelectedItem();
      const index = selected ? items.indexOf(selected) : -1;
      this.setSelected(items[index + 1], selected);
    },

    onMouseOver(event) {
      const item = event.target.closest(`.${itemClass}`);
      this.setSelected(item, this.getSelectedItem());
    },
  },
});
</script>
