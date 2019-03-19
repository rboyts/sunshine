<template>
  <s-drop-down
    search
    multiple
    allow-missing
    label=""
    :items="items"
    :placeholder="placeholder"
    :max-selected-shown="8"
    v-model="internalValue"
  >
    <template v-slot:selected="{ value, toggleChecked }">
      <div :class="classes('pills')">
        <div
          v-for="(val, i) in value" :key="i"
          :class="classes('pill')"
        >
          <span
            class="sunshine24-close"
            :class="classes('pill-icon')"
            @click.prevent.stop="toggleChecked(val)"
          />
          {{ val.extendedLabel || val.label }}
        </div>
      </div>
    </template>

    <template v-slot:above>
      <div :class="classes('tabs')">

        <div v-for="(section, i) in sections" :key="i"
          :class="classes('tabs', 'tab', { active: i === sectionIndex })">
          <a @click.prevent="sectionIndex = i">{{ section.label }}</a>
        </div>
      </div>
      <s-list-separator />
    </template>

  </s-drop-down>
</template>

<script>
import Vue from 'vue';
import { ClassesMixin } from '../lib/utils';


export default Vue.extend({
  name: 's-filter-drop-down',

  mixins: [
    ClassesMixin,
  ],

  props: {
    sections: Array,
    value: Array,
    label: String,
  },

  data() {
    return {
      internalValue: [],
      sectionIndex: -1,
    };
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
      return this.currentSection ? this.currentSection.items : [];
    },
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
});
</script>
