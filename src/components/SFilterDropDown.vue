<!--

FIXME:
Handle identical keys in different sections.
Incoming keys only need to be unique withing each section.

-->

<template>
  <s-menu v-model="isOpen" :class="classes()" :toggleOnClick="false" @closed="$emit('closed')">
    <template v-slot:activator>
      <s-base-input
        :class="classes('input')"
        :hasFocus="hasFocus"
        :isEmpty="false"
        :readonly="!isOpen"
        :inactive="inactive"
        :error="error"
        @click.native="onClick"
        @keydown.native.up.prevent="onArrowUp"
        @keydown.native.down.prevent="onArrowDown"
        @keydown.native.right.prevent="onKeyRight"
        @keydown.native.left.prevent="onKeyLeft"
        @keydown.native.enter.prevent="onEnter"
        @keydown.native.esc.prevent="onEscape"
        @keydown.native.backspace="onBackspace"
        @keydown.native.space="onSpace"
        @mousedown.native.prevent=""
      >
        <div :class="classes('pills')">
          <div
            v-for="val in selectedItems" :key="val.key"
            :class="classes('pill', { [val.type]: true })"
          >
            <span
              class="sunshine24-close"
              :class="classes('pill-icon')"
              @click.prevent.stop="onItemRemove(val)"
            />
            {{ val.label }}
            <span v-if="val.category" class="s-muted-text"> ({{ val.category }})</span>
          </div>
          <div v-if="internalValue.search" :class="classes('pill', { 'search': true })">
            <span
              class="sunshine24-close"
              :class="classes('pill-icon')"
              @click.prevent.stop="internalValue.search = ''"
            />
            {{ internalValue.search }}
          </div>
        </div>

        <input
          ref="input"
          :class="{
            's-input__input': true,
            's-input__input--with-label': !!label,
            's-input__input--transparent': !isOpen,
          }"
          type="text"
          :disabled="inactive"
          :placeholder="placeholder"
          v-model="filter"
          @click.stop="onClick"
          @focus="hasFocus = true"
          @blur="hasFocus = false"
        />
          <!-- @input="onInput" -->

        <span
          class="sunshine24-dropdownarrow"
          :class="classes('caret', { open: isOpen })"
          @click.stop="onCaretClick"
        />
      </s-base-input>
    </template>

    <template v-slot:content>
      <s-menu-list>
        <div :class="classes('header')">
          <div :class="classes('tabs')">
            <div v-show="showSuggestionsTab"
              :class="classes('tabs', 'tab', { active: sectionIndex === -1 })">
              <a @click.prevent="onClickTab(-1)">Suggestions</a>
            </div>

            <div v-for="(section, i) in sections" :key="i"
              :class="classes('tabs', 'tab', { active: i === sectionIndex })">
              <a @click.prevent="onClickTab(i)">{{ section.label }}</a>
            </div>
          </div>

          <div :class="classes('loading')">
            <div v-if="loading" :class="classes('loading-progress')" />
          </div>
        </div>

        <s-list-item
          v-for="item in items"
          :key="item.key"
          @click="onItemClick(item)"
        >
          <span v-html="highlightLabelHtml(item)" />
          <span v-if="sectionIndex === -1" class="s-muted-text">&nbsp;({{ item.category }})</span>
        </s-list-item>
      </s-menu-list>
    </template>
  </s-menu>
</template>

<script>
import Vue from 'vue';
import { ClassesMixin } from '../lib/utils';
import SBaseInput from './SBaseInput.vue';
import SListItem from './SListItem.vue';
import SMenu from './SMenu.vue';
import SMenuList from './SMenuList.vue';


export default Vue.extend({
  name: 's-filter-drop-down',

  mixins: [
    ClassesMixin,
  ],

  components: {
    SBaseInput,
    SListItem,
    SMenu,
    SMenuList,
  },

  props: {
    sections: Array,
    value: Object,

    label: String,
    error: String,

    loading: {
      type: Boolean,
      default: false,
    },

    inactive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      internalValue: {
        filters: [],
        search: null,
      },
      sectionIndex: -1,
      filter: '',
      hasFocus: false,
      isOpen: false,
    };
  },

  watch: {
    value(val) {
      this.internalValue = val;
    },

    internalValue: {
      handler(val) {
        if (val !== this.value) {
          this.$emit('input', val);
        }
      },
      deep: true,
    },

    filter(val) {
      if (val) {
        this.isOpen = true;
      }
    },

    hasFocus(val) {
      if (!val) {
        this.isOpen = false;
      }
    },

    isOpen(val) {
      if (!val) {
        this.filter = '';
      }
    },
  },

  computed: {
    placeholder() {
      return (this.internalValue.filters.length === 0 ?
        'Filter input field, with suggestions for filter words such as department, machine type or project name...' :
        'Add filter...');
    },

    currentSection() {
      return this.sections[this.sectionIndex];
    },

    items() {
      if (!(this.currentSection || this.filter)) return [];

      const flt = this.filter.toLocaleLowerCase();
      return this.allItems
        .filter(it => !this.currentSection || it.sectionKey === this.currentSection.key)
        .filter(it => !this.internalValue.filters.includes(it.key) &&
          it.label.toLocaleLowerCase().includes(flt));
    },

    selectedItems() {
      return this.internalValue.filters.map(key => this.allItems.find(it => it.key === key));
    },

    showSuggestionsTab() {
      return !!this.filter;
    },

    allItems() {
      return this.sections.reduce((acc, sec) => (
        acc.concat(sec.items.map(item => ({
          ...item,
          sectionKey: sec.key,
          itemKey: item.key,
          key: `${sec.key}:${item.key}`,
        })))
      ), []);
    },
  },

  methods: {
    onClick() {
      if (this.inactive) return;

      this.isOpen = true;
      this.setFocus();
    },

    onCaretClick(event) {
      if (this.inactive) return;
      this.isOpen = !this.isOpen;
    },

    setFocus() {
      this.$refs.input.focus();
    },

    onClickTab(index) {
      if (this.sectionIndex === index) {
        this.sectionIndex = -1;
      } else {
        this.sectionIndex = index;
      }
    },

    onArrowUp() {
      if (!this.isOpen) {
        this.isOpen = true;
      }
    },

    onArrowDown() {
      if (!this.isOpen) {
        this.isOpen = true;
      }
    },

    onSpace() {
      if (!this.isOpen) {
        this.isOpen = true;
      }
    },

    onEnter() {
      if (this.filter) {
        this.internalValue.search = this.filter;
        this.filter = '';
      }
      this.isOpen = true;
    },

    onEscape() {
      if (this.isOpen) {
        if (this.filter) {
          this.filter = '';
        } else {
          this.isOpen = false;
        }
      }
    },

    onBackspace(event) {
      if (this.isOpen) {
        if (!this.filter) {
          if (this.internalValue.search) {
            this.internalValue.search = '';
          } else {
            this.internalValue.filters =
              this.internalValue.filters.slice(0, this.internalValue.filters.length - 1);
          }
          event.preventDefault();
        }
      } else {
        this.isOpen = true;
        event.preventDefault();
      }
    },

    onKeyRight() {
      if (this.sectionIndex < this.sections.length - 1) {
        this.sectionIndex += 1;
      }
    },

    onKeyLeft() {
      if (this.sectionIndex > -1) {
        this.sectionIndex -= 1;
      }
    },

    onItemClick(item) {
      this.internalValue.filters = this.internalValue.filters.concat(item.key);
      this.filter = '';
    },

    onItemRemove(item) {
      this.internalValue.filters = this.internalValue.filters.filter(it => it !== item.key);
    },

    highlightLabelHtml(item) {
      const flt = this.filter.toLocaleLowerCase();
      let text = item.label;
      const idx = text.toLocaleLowerCase().indexOf(flt);
      if (idx !== -1) {
        text = `${text.slice(0, idx)}<b>${text.slice(idx, idx + flt.length)}</b>${text.slice(idx + flt.length)}`;
      }
      return text;
    },
  },
});
</script>
