<template>
  <div
    @mouseover="onMouseOver"
    @mousedown.prevent=""
  >
    <global-events
      @keydown.capture.down.prevent="selectNext"
      @keydown.capture.up.prevent="selectPrevious"
      @keydown.capture.space="onSpace"
      @keydown.capture.enter.prevent="onEnter"
    />

    <div
      class="s-list"
      ref="list"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import GlobalEvents from 'vue-global-events';

const itemClass = 's-list-item';
const selectedItemClass = 's-list-item--selected';

export default Vue.extend({
  name: 'SMenuList',

  components: {
    GlobalEvents,
  },

  methods: {
    getSelectedItem() {
      return this.$el.querySelector(`.${selectedItemClass}`);
    },

    getItems() {
      return Array.from(this.$el.querySelectorAll(`.${itemClass}`));
    },

    onSpace(event) {
      const selected = this.getSelectedItem();
      if (selected) {
        event.preventDefault();
        selected.click();
      }
    },

    onEnter(event) {
      const selected = this.getSelectedItem();
      if (selected) {
        event.stopPropagation();
        selected.dispatchEvent(new Event('accept'));
      }
    },

    setSelected(next, prev) {
      if (!next) return;
      if (prev) {
        prev.classList.remove(selectedItemClass);
      }
      next.classList.add(selectedItemClass);
      this.ensureItemVisible(next);
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

    ensureItemVisible(item) {
      const list = this.$refs.list.$el;
      if (item.offsetTop < list.scrollTop) {
        item.scrollIntoView(true);
      } else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.offsetHeight) {
        item.scrollIntoView(false);
      }
    },
  },
});
</script>
