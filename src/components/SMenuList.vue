<template>
  <div
    class="s-menu-list"
    @mouseover="onMouseOver"
    @mousedown.prevent=""
  >
    <global-events
      @keydown.capture.down.prevent="selectNext"
      @keydown.capture.up.prevent="selectPrevious"
      @keydown.capture.space="onSpace"
      @keydown.capture.enter.prevent="onEnter"
      @keydown="onKeyDown"
    />

    <ul
      class="s-list"
      ref="list"
    >
      <slot />
    </ul>
  </div>
</template>

<script>
import Vue from 'vue';
import GlobalEvents from 'vue-global-events';

const SEARCH_RESET_TIMER = 400;
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

    onKeyDown(event) {
      const { key } = event;
      if (key.length > 1 || key === ' ') return;
      this.startResetTimer();
      this.setSearchString(key);
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
      const { list } = this.$refs;
      if (item.offsetTop < list.scrollTop) {
        item.scrollIntoView(true);
      } else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.offsetHeight) {
        item.scrollIntoView(false);
      }
    },

    setSearchString(key) {
      if (this.$_searchString === undefined) {
        this.$_searchString = '';
      }

      const klc = key.toLowerCase();
      this.$_searchString += klc;
      const sameChar = this.$_searchString.split('').every(c => c === klc);
      if (sameChar) {
        this.$_searchString = klc;
      }

      this.selectItem(this.$_searchString);
    },

    selectItem(searchString) {
      const item = this.findItem(searchString);
      if (item !== null) {
        const prev = this.getSelectedItem();
        this.setSelected(item, prev);
      }
    },

    findItem(searchString) {
      const items = this.getItems();
      const selected = this.getSelectedItem();
      const index = selected ? items.indexOf(selected) : -1;
      let item = this.searchArray(index + 1, items.length, items, searchString);

      if (!item) {
        item = this.searchArray(0, index, items, searchString);
      }
      return item;
    },

    searchArray(from, to, items, searchString) {
      let item = null;
      for (let i = from; i < to; i++) {
        const tag = items[i].dataset.searchString;
        if (tag && tag.toLowerCase().startsWith(searchString)) {
          item = items[i];
          break;
        }
      }
      return item;
    },

    startResetTimer() {
      clearTimeout(this.$_timerId);
      this.$_timerId = setTimeout(() => { this.$_searchString = ''; }, SEARCH_RESET_TIMER);
    },
  },

  beforeDestroy() {
    clearTimeout(this.$_timerId);
  },
});
</script>
