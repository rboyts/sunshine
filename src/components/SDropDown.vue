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
  <s-menu
    v-model="isOpen"
    :class="$class()"
    :toggle-on-click="false"
    @closed="$emit('closed')"
  >
    <template v-slot:activator>
      <s-base-input
        :class="$class('input')"
        :has-focus="hasFocus"
        :is-empty="textValue == '' && text == ''"
        :readonly="!(search && isOpen)"
        :inactive="inactive"
        :label="label"
        :error="error"
        @click="onClick"
        @keydown.up.prevent.stop="onArrowUp"
        @keydown.down.prevent.stop="onArrowDown"
        @keydown.enter.prevent="onEnter"
        @keydown.esc.prevent="onEscape"
        @keydown.backspace="onBackspace"
        @keydown.space="onSpace"
        @mousedown="$event.preventDefault()"
      >
        <template v-slot:icon>
          <slot name="icon" />
        </template>

        <span
          v-if="textValue"
          :class="$class('label', { 'with-label': !!label })"
        >
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
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
        >

        <div
          v-else
          ref="input"
          :class="$class('spacer')"
          :tabIndex="inactive ? undefined : 0"
          @focus="onFocus"
          @blur="onBlur"
        />

        <span
          class="sunshine24-dropdownarrow"
          :class="$class('caret', caretModifiers)"
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
              :search-string="node.searchString || node[labelKey]"
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

const validateUniqueKeys = val => (
  val.every((it, index) => !!it.key &&
    val.findIndex((o) => o.key === it.key) === index)
);

export default Vue.extend({
  name: 'SDropDown',
  inheritAttrs: false,

  $_veeValidate: {
    value() {
      return this.internalValue;
    },
  },

  components: {
    SBaseInput,
    SListItem,
    SMenu,
    SMenuList,
  },

  props: {
    label: {
      type: String,
      default: '',
    },

    error: {
      type: String,
      default: undefined,
    },

    items: {
      type: Array,
      required: true,
      validator: validateUniqueKeys,
    },

    labelKey: {
      type: String,
      default: 'label',
    },

    // value must be an array of T if `multiple` is true, of a single instance
    // of T otherwise, where T is the type of the `key` attribute in each item.
    // Typically, T is either String or Number.
    value: {
      type: null,
      default: undefined,
    },

    search: {
      type: Boolean,
      default: false,
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    /**
     * Strictly ensure that the value (v-model) is always an available option
     * (every value if multiple is true).
     *
     * XXX: This seems to be a bad idea in general, because it may cause users
     * to change fields that they don't intend to. Instead of unselecting
     * invalid values, we show the key of the original value in angular
     * brackets.
     * Also, the current implementation of this property, doesn't work in all
     * cases. It works when items are changed after value, but not when value
     * is set programmatically after items are loaded.
     */
    strict: {
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
      if (!this.strict) return;

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

  beforeMount() {
    this.validateProps();
  },

  beforeUpdate() {
    this.validateProps();
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
        return item ? item[this.labelKey] : `[${key}]`;
      };

      if (this.multiple) {
        if (this.internalValue.length > this.maxSelectedShown) {
          // TODO customize/i18n
          return this.$tc('s-drop-down.selected', this.internalValue.length);
        } else {
          return this.internalValue.map(getLabel).join(', ');
        }
      } else {
        return getLabel(this.internalValue);
      }
    },
  },

  methods: {
    onFocus() {
      this.hasFocus = true;
      this.$emit('focus');
    },

    onBlur() {
      this.hasFocus = false;
      this.$emit('blur');
    },

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

    // During debugging, we'll do some heavy valudation of item key and value types
    validateProps() {
      if (process.env.NODE_ENV === 'production') return;

      // Show warnings like Vue prop validation
      const warn = msg => Vue.util.warn(msg, this);

      const { items, multiple, value } = this;

      if (multiple) {
        if (typeof value !== 'undefined' && !Array.isArray(value)) {
          warn('Invalid prop: When "multiple" is true, "value" must be an array. ' +
            `Found ${value} (${typeof value}).`);
        }
      }

      if (items.length === 0) return;

      const first = items[0];

      const item = items.find(it => typeof it.key !== typeof first.key);
      if (item) {
        warn('Invalid prop: All items must have the same type of "key". ' +
          `Found ${first.key} (${typeof first.key}) and ${item.key} (${typeof item.key}).`);
      }

      if (multiple) {
        if (value) {
          const val = value.find(v => typeof v !== typeof first.key);
          if (val) {
            warn('Invalid prop: Values must have the same type as keys. ' +
              `Found ${val} (${typeof val}) and ${first.key} (${typeof first.key}).`);
          }
        }
      } else if (value != null && typeof value !== typeof first.key) {
        warn('Invalid prop: "value" must have the same type as keys. ' +
          `Found ${value} (${typeof value}) and ${first.key} (${typeof first.key}).`);
      }
    },
  },
});
</script>
