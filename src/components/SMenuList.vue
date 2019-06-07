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
import { createWrappingArray } from '../lib/utils';

const TAG_RESET_TIMER = 400;
const itemClass = 's-list-item';
const selectedItemClass = 's-list-item--selected';

export default Vue.extend({
  name: 'SMenuList',

  components: {
    GlobalEvents,
  },

  computed: {
    wrappingItems() {
      return createWrappingArray(this.items);
    },

    items() {
      let items = [];
      this.getItems().forEach(el => {
        if (el.dataset && el.dataset.searchTag) {
          items.push({
            key: el.dataset.searchTag,
            el,
          });
        }
      });
      return items;
    },
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
      if (this.items.length === 0) return;
      this.startResetTimer();

      const { key } = event;
      this.setTag(key);
      this.selectItem(key);
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

    setTag(key) {
      if (this.$_tag === undefined) {
        this.$_tag = '';
      }

      const klc = key.toLowerCase();
      this.$_tag = klc.length === 1 && klc !== ' ' ? this.$_tag + klc : '';
      const sameChar = this.$_tag.split('').every(c => c === klc);
      if (sameChar && this.$_tag) {
        this.$_tag = this.$_tag[this.$_tag.length - 1];
      }
    },

    selectItem() {
      if (!this.$_tag) return;
      const item = this.findItem(this.$_tag);
      if (item !== null) {
        const prev = this.getSelectedItem();
        this.setSelected(item.el, prev);
      }
    },

    findItem(searchTag) {
      let item = null;
      for (let _ of this.items) {
        const it = this.wrappingItems.next().value;
        if (it.key.toLowerCase().startsWith(searchTag)) {
          item = it;
          break;
        }
      }
      return item;
    },

    startResetTimer() {
      clearTimeout(this.$_timerId);
      this.$_timerId = setTimeout(() => { this.$_tag = ''; }, TAG_RESET_TIMER);
    },
  },

  beforeDestroy() {
    clearTimeout(this.$_timerId);
  },
});
</script>
