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
    v-model="internalValue"
    @keydown.native.right.prevent="onKeyRight"
    @keydown.native.left.prevent="onKeyLeft"
    @closed="sectionIndex = -1"
    @text-input="onTextInput"
  >
    <template v-slot:selected="{ value, toggleChecked }">
      <div :class="classes('pills')">
        <div
          v-for="(val, i) in value" :key="i"
          :class="classes('pill', { [val.type]: true })"
        >
          <span
            class="sunshine24-close"
            :class="classes('pill-icon')"
            @click.prevent.stop="toggleChecked(val)"
          />
          {{ val.label }}
          <span v-if="val.category" class="s-muted-text"> ({{ val.category }})</span>
        </div>
      </div>
    </template>

    <template v-slot:above>
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
    value: Array,
    label: String,
  },

  data() {
    return {
      internalValue: [],
      sectionIndex: -1,
      filter: '',
    };
  },

  watch: {
    value(val) {
      this.internalValue = val;
    },

    internalValue(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },
  },

  computed: {
    placeholder() {
      return (this.internalValue.length === 0 ?
        'Filter input field, with suggestions for filter words such as department, machine type or project name...' :
        'Add filter...');
    },

    currentSection() {
      return this.sections[this.sectionIndex];
    },

    items() {
      if (this.currentSection) {
        return this.getFilteredItemsFromSection(this.currentSection);
      } else if (this.filter) {
        return this.sections.reduce((acc, sec) => (
          acc.concat(this.getFilteredItemsFromSection(sec))
        ), []);
      } else {
        return [];
      }
    },

    showSuggestionsTab() {
      return !!this.filter;
    },
  },

  methods: {
    getFilteredItemsFromSection(section) {
      const flt = this.filter.toLocaleLowerCase();
      const { items } = section;
      return items.filter(i => (
        !this.internalValue.includes(i) &&
        i.label.toLocaleLowerCase().indexOf(flt) !== -1));
    },

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
      const val = this.internalValue.filter(v => v.type !== 'search');
      const search = {
        type: 'search',
        label: `"${text}"`,
        value: text,
      };
      this.$emit('input', val.concat(search));
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
