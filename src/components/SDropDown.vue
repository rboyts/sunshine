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
  <s-menu v-model="isOpen" :class="classes()" :toggleOnClick="false" @closed="$emit('closed')">
    <template v-slot:activator>
      <s-base-input
        :class="classes('input')"
        :hasFocus="hasFocus"
        :isEmpty="textValue == '' && text == ''"
        :readonly="!(search && isOpen)"
        :inactive="inactive"
        :label="label"
        :error="error"
        @click.native="onClick"
        @keydown.native.up.prevent="onArrowUp"
        @keydown.native.down.prevent="onArrowDown"
        @keydown.native.enter.prevent="onEnter"
        @keydown.native.esc.prevent="onEscape"
        @keydown.native.backspace="onBackspace"
        @keydown.native.space="onSpace"
        @mousedown.native="$event.preventDefault()"
      >
        <span v-if="textValue" :class="classes('label', { 'with-label': !!label })">
          {{ textValue }}
        </span>

        <input
          v-if="search"
          ref="input"
          :class="{
            's-input__input': true,
            's-input__input--with-label': !!label,
            's-input__input--transparent': !isOpen,
          }"
          type="text"
          :disabled="inactive"
          :value="filter"
          v-bind="$attrs"
          @click.stop="onClickSearch"
          @focus="hasFocus = true"
          @blur="hasFocus = false"
          @input="onInput"
        />

        <div
          v-else
          ref="input"
          :class="classes('spacer')"
          :tabIndex="inactive ? undefined : 0"
          @focus="hasFocus = true"
          @blur="hasFocus = false"
        />

        <span
          class="sunshine24-dropdownarrow"
          :class="classes('caret', caretModifiers)"
          @click.native="onCaretClick"
        />
      </s-base-input>
    </template>

    <template v-slot:content>
      <s-menu-list>
        <slot name="above" />
        <template v-for="node in itemValues">
          <slot
            v-bind="{
              item: node.item,
              label: node[labelKey],
              onChange: checked => onItemChange(node.key, checked),
              onClick: () => onItemClick(node.key),
            }"
          >
            <s-list-item
              :key="node.key"
              :checkable="multiple"
              :checked="node.checked"
              @change="onItemChange(node.key, $event)"
              @click="onItemClick(node.key)"
            >
              {{ node[labelKey] }}
            </s-list-item>
          </slot>
        </template>
      </s-menu-list>
    </template>
  </s-menu>
</template>

<script>
import Vue from 'vue';
import SBaseInput from './SBaseInput.vue';
import SListItem from './SListItem.vue';
import SMenu from './SMenu.vue';
import SMenuList from './SMenuList.vue';
import { ClassesMixin } from '../lib/utils';

const validateUniqueKeys = val => (
  val.every((it, index) => !!it.key &&
    val.findIndex((o) => o.key === it.key) === index)
);

export default Vue.extend({
  name: 's-drop-down',
  inheritAttrs: false,

  $_veeValidate: {
    value() {
      return this.internalValue;
    },
  },

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
    label: String,

    error: String,

    items: {
      type: Array,
      validator: validateUniqueKeys,
    },

    labelKey: {
      type: String,
      default: 'label',
    },

    value: {
      type: [String, Array],
    },

    search: {
      type: Boolean,
      default: false,
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    maxSelectedShown: {
      type: Number,
      default: 2,
    },

    inactive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      filter: '',
      internalValue: null,
      hasFocus: false,
      isOpen: false,
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
      const keys = val.map(it => it.key);
      if (this.multiple) {
        this.internalValue = this.internalValue.filter(k => keys.includes(k));
      } else if (this.internalValue) {
        if (!keys.includes(this.internalValue)) {
          this.internalValue = null;
        }
      }
    },

    hasFocus(val) {
      if (!val) {
        this.isOpen = false;
      }
    },

    isOpen(val) {
      if (!val) {
        this.clearFilter();
      }
    },
  },

  computed: {
    filteredItems() {
      if (!this.filter) return this.items;
      const flt = this.filter.toLocaleLowerCase();
      return this.items.filter(it => (
        it[this.labelKey].toLocaleLowerCase().indexOf(flt) !== -1));
    },

    caretModifiers() {
      return { open: this.isOpen };
    },

    itemValues() {
      return this.filteredItems.map(item => {
        let checked = this.multiple && this.internalValue.includes(item.key);
        return {
          ...item,
          item,
          checked,
        };
      });
    },

    text() {
      return this.filter || '';
    },

    textValue() {
      if (!this.internalValue) return '';

      // Hide when typing in single-select mode
      if (!this.multiple && this.search && this.isOpen) return '';

      const getLabel = key => {
        const item = this.items.find(it => it.key === key);
        return item ? item[this.labelKey] : '** ERROR **';
      };

      if (this.multiple) {
        if (this.internalValue.length > this.maxSelectedShown) {
          // TODO customize/i18n
          return `${this.internalValue.length} selected`;
        } else {
          return this.internalValue.map(getLabel).join(', ');
        }
      } else {
        return getLabel(this.internalValue);
      }
    },
  },

  methods: {
    onClick() {
      if (this.inactive) return;

      this.isOpen = !this.isOpen;
      this.setFocus();
    },

    onClickSearch() {
      if (this.inactive) return;

      this.isOpen = true;
      this.setFocus();
    },

    setFocus() {
      this.$refs.input.focus();
    },

    onArrowUp() {
      if (!this.isOpen) {
        if (this.multiple) {
          this.isOpen = true;
        } else {
          this.internalValue = this.getPreviousItem(this.internalValue);
        }
      }
    },

    onArrowDown() {
      if (!this.isOpen) {
        if (this.multiple) {
          this.isOpen = true;
        } else {
          this.internalValue = this.getNextItem(this.internalValue);
        }
      }
    },

    onEnter() {
      if (this.search && this.filter) {
        this.$emit('text-input', this.filter);
        this.clearFilter();
      }
      this.isOpen = true;
    },

    onEscape() {
      if (this.isOpen) {
        if (this.filter) {
          this.clearFilter();
        } else {
          this.isOpen = false;
        }
      }
    },

    onBackspace(event) {
      if (this.isOpen) {
        if (!this.filter) {
          if (this.multiple) {
            this.internalValue = this.internalValue.slice(0, this.internalValue.length - 1);
            event.preventDefault();
          }
        }
      } else {
        this.isOpen = true;
        event.preventDefault();
      }
    },

    onSpace(event) {
      if (!this.isOpen) {
        this.isOpen = true;
      }
    },

    getPreviousItem(key) {
      let index = key == null ? -1 : this.filteredItems.findIndex(it => it.key === key);
      if (index === -1) index = this.filteredItems.length;
      return this.filteredItems[Math.max(0, index - 1)].key;
    },

    getNextItem(key) {
      let index = key == null ? -1 : this.filteredItems.findIndex(it => it.key === key);
      return this.filteredItems[Math.min(index + 1, this.filteredItems.length - 1)].key;
    },

    onCaretClick(event) {
      if (this.inactive) return;

      this.isOpen = !this.isOpen;
      event.stopPropagation();
    },

    onItemChange(item, checked) {
      if (!this.multiple) return;

      this.setChecked(item, checked);

      this.clearFilter();
    },

    onItemClick(key) {
      if (!this.multiple) {
        this.internalValue = key;
      }

      this.clearFilter();
      this.isOpen = false;
    },

    async onInput(event) {
      const val = event.target.value;
      if (val.length) {
        this.isOpen = true;
        await Vue.nextTick();
      }
      this.filter = val;
    },

    toggleChecked(key) {
      if (!this.multiple) throw new Error('Expected multiple to be true');

      const currentValue = this.internalValue || [];
      this.setChecked(key, currentValue.indexOf(key) === -1);
    },

    setChecked(key, checked) {
      if (!this.multiple) throw new Error('Expected multiple to be true');

      const currentValue = this.internalValue || [];
      let newValue;
      if (checked) {
        newValue = (currentValue.indexOf(key) === -1) ?
          currentValue.concat(key) :
          currentValue;
      } else {
        newValue = currentValue.filter(i => i !== key);
      }
      this.internalValue = newValue;
    },

    clearFilter() {
      this.filter = '';
    },
  },
});
</script>
