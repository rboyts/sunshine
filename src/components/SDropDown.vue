<!--

Use cases:

- Simple drop-down (no keyboard input, just select one of multiple available options)
- Drop-down with search (use keyboard input only to filter available options,
  not possible to input arbitrary text)
- Auto-complete (list is initially empty, only shows suggestions when partial text is entered)
- Multi-select (items have checkbox, input shows comma separated list or "N items selected")
- Multi-select with search
- Search/create new when not found?

-->


<template>
  <s-drop-down-internal
    v-model="internalValue"
    :items="filteredItems"
    :multiple="multiple"
    :filter.sync="filter"
    :labelKey="labelKey"

    v-bind="$attrs"
  >

    <!-- Pass on all slots -->
    <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>

  </s-drop-down-internal>
</template>

<script lang="ts">
import Vue from 'vue';
import SDropDownInternal from './SDropDown/SDropDownInternal.vue';

export default Vue.extend({
  name: 's-drop-down',
  inheritAttrs: false,

  $_veeValidate: {
    value() {
      return this.internalValue;
    },
  },

  components: {
    SDropDownInternal,
  },

  props: {
    items: Array as () => object[],

    value: [Object, Array],

    multiple: Boolean,

    labelKey: {
      type: String,
      default: 'label',
    },
  },

  data() {
    return {
      filter: '',
      internalValue: null as any,
    };
  },

  watch: {
    value: {
      handler(val) {
        if (this.multiple) {
          this.internalValue = val || [];
        } else {
          this.internalValue = val;
        }
      },
      immediate: true,
    },

    internalValue(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },

    // Update selection when data is changed.
    items(val) {
      const byKey = (needle: any) => val.find((it: any) => it.key === needle.key) || null;
      if (this.multiple) {
        this.internalValue = this.internalValue.map(byKey).filter((v: any) => !!v);
      } else if (this.internalValue) {
        this.internalValue = byKey(this.internalValue);
      }
    },
  },

  computed: {
    filteredItems(): object[] {
      if (!this.filter) return this.items;
      const flt = this.filter.toLocaleLowerCase();
      return this.items.filter((i: any) => (
        i[this.labelKey].toLocaleLowerCase().indexOf(flt) !== -1));
    },
  },
});
</script>
