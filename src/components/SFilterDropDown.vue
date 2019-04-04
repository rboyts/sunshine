<!--

FIXME:
Handle identical keys in different sections.
Incoming keys only need to be unique withing each section.

-->

<template>
  <s-drop-down-internal
    search
    multiple
    allow-missing
    label=""
    :filter.sync="filter"
    :items="items"
    :placeholder="placeholder"
    :max-selected-shown="8"
    v-model="internalValue.filters"
    @keydown.native.right.prevent="onKeyRight"
    @keydown.native.left.prevent="onKeyLeft"
    @closed="sectionIndex = -1"
    @text-input="onTextInput"
  >
    <template v-slot:selected="{ toggleChecked }">
      <div :class="classes('pills')">
        <div
          v-for="val in selectedItems" :key="val.key"
          :class="classes('pill', { [val.type]: true })"
        >
          <span
            class="sunshine24-close"
            :class="classes('pill-icon')"
            @click.prevent.stop="toggleChecked(val.key)"
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
    </template>

    <template v-slot:above>
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
    </template>

    <template v-slot="{ item, onChange }">
      <s-list-item @click="onChange(true)">
        <span v-html="highlightLabelHtml(item)" />
        <span v-if="sectionIndex === -1" class="s-muted-text">&nbsp;({{ item.category }})</span>
      </s-list-item>
    </template>

  </s-drop-down-internal>
</template>

<script>
import Vue from 'vue';
import { ClassesMixin } from '../lib/utils';
import SDropDownInternal from './SDropDown/SDropDownInternal.vue';


export default Vue.extend({
  name: 's-filter-drop-down',

  mixins: [
    ClassesMixin,
  ],

  components: {
    SDropDownInternal,
  },

  props: {
    sections: Array,
    value: Object,
    label: String,

    loading: {
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
    onClickTab(index) {
      if (this.sectionIndex === index) {
        this.sectionIndex = -1;
      } else {
        this.sectionIndex = index;
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

    onTextInput(text) {
      this.internalValue.search = text;
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
