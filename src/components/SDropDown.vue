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
  <s-menu v-model="isOpen" :class="classes()" :toggleOnClick="false">
    <template v-slot:activator>
      <s-base-input
        :class="classes('input')"
        :hasFocus="hasFocus"
        :isEmpty="textValue == '' && text == ''"
        :readonly="!search"
        :inactive="inactive"
        v-bind="$attrs"
        @click.native="onClick"
        @keydown.native.up.prevent="onArrowUp"
        @keydown.native.down.prevent="onArrowDown"
        @keydown.native.enter.prevent="onEnter"
        @keydown.native.esc.prevent="onEscape"
        @keydown.native.backspace="onBackspace"
        @keydown.native.space="onSpace"
        @mousedown.native="$event.preventDefault()"
      >
        <label v-if="textValue" :class="classes('label')">{{ textValue }}</label>

        <input
          v-if="search"
          ref="input"
          class="s-input__input"
          type="text"
          :disabled="inactive"
          :value="filter"
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

        <s-icon
          package="sunshine24"
          name="dropdownarrow"
          :class="classes('caret', caretModifiers)"
          @click.native="onCaretClick"
        />
      </s-base-input>
    </template>

    <template v-slot:content>
      <s-menu-list>
        <s-list-item
          v-for="item in itemValues"
          :key="item.key"
          :checkable="multiple"
          :checked="item.checked"
          @change="onItemChange(item.item, $event)"
          @click="onItemClick(item.item)"
        >
          {{ item[labelKey] }}
        </s-list-item>
      </s-menu-list>
    </template>
  </s-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import SBaseInput from './SBaseInput.vue';
import SListItem from './SListItem.vue';
import SMenu from './SMenu.vue';
import SMenuList from './SMenuList.vue';
import SIcon from './SIcon.vue';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-drop-down',

  components: {
    SBaseInput,
    SListItem,
    SMenu,
    SMenuList,
    SIcon,
  },

  props: {
    items: Array as () => object[],

    labelKey: {
      type: String,
      default: 'label',
    },

    value: {
      type: [Object, Array],
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
      internalValue: null as any,
      hasFocus: false,
      isOpen: false,
      filter: '',
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
      this.$emit('input', val);
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
    caretModifiers(): object {
      return { open: this.isOpen };
    },

    filteredItems(): object[] {
      if (!this.filter) return this.items;
      const flt = this.filter.toLocaleLowerCase();
      return this.items.filter((i: any) => (
        i[this.labelKey].toLocaleLowerCase().indexOf(flt) !== -1)
      );
    },

    itemValues(): object[] {
      return this.filteredItems.map(item => {
        let checked = this.multiple && this.internalValue.includes(item);
        return {
          ...item,
          item,
          checked,
        };
      });
    },

    text(): string {
      return this.filter || '';
    },

    textValue(): string {
      if (!this.internalValue) return '';

      // Hide when typing in single-select mode
      if (!this.multiple && this.filter) return '';

      if (this.multiple) {
        if (this.internalValue.length > this.maxSelectedShown) {
          // TODO customize/i18n
          return `${this.internalValue.length} selected`;
        } else {
          return this.internalValue.map((v: any) => v[this.labelKey]).join(', ');
        }
      } else {
        return this.internalValue[this.labelKey];
      }
    },

    labels(): string[] {
      if (!this.multiple) return [];

      if (this.internalValue.length > this.maxSelectedShown) {
        return [`${this.internalValue.length} selected`];
      } else {
        return this.internalValue.map((v: any) => v[this.labelKey]);
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
      const el = this.$refs.input as HTMLElement;
      el.focus();
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

    onBackspace(event: KeyboardEvent) {
      if (this.isOpen) {
        if (!this.filter) {
          if (this.multiple) {
            this.internalValue.pop();
            event.preventDefault();
          }
        }
      } else {
        this.isOpen = true;
        event.preventDefault();
      }
    },

    onSpace(event: KeyboardEvent) {
      if (!this.isOpen) {
        this.isOpen = true;
        event.preventDefault();
      }
    },

    getPreviousItem(item: object | null): object {
      let index = item == null ? -1 : this.filteredItems.indexOf(item);
      if (index === -1) index = this.filteredItems.length;
      return this.filteredItems[Math.max(0, index - 1)];
    },

    getNextItem(item: object | null): object {
      let index = item == null ? -1 : this.filteredItems.indexOf(item);
      return this.filteredItems[Math.min(index + 1, this.filteredItems.length - 1)];
    },

    onCaretClick(event: PointerEvent) {
      if (this.inactive) return;

      this.isOpen = !this.isOpen;
      event.stopPropagation();
    },

    onItemChange(item: any, checked: boolean) {
      if (!this.multiple) return;

      this.setChecked(item, checked);

      this.filter = '';
    },

    onItemClick(item: any) {
      if (!this.multiple) {
        this.internalValue = item;
      }

      this.filter = '';
      this.isOpen = false;
    },

    async onInput(event: InputEvent) {
      const el = event.target as HTMLInputElement;
      const val = el.value;
      if (val.length) {
        this.isOpen = true;
        await Vue.nextTick();
      }
      this.filter = val;
    },

    toggleChecked(item: any) {
      if (!this.multiple) throw new Error('Expected multiple to be true');

      const currentValue = this.internalValue as object[] || [];
      this.setChecked(item, currentValue.indexOf(item) === -1);
    },

    setChecked(item: any, checked: boolean) {
      if (!this.multiple) throw new Error('Expected multiple to be true');

      const currentValue = this.internalValue as object[] || [];
      let newValue: object[];
      if (checked) {
        newValue = (currentValue.indexOf(item) === -1) ? currentValue.concat(item) : currentValue;
      } else {
        newValue = currentValue.filter(i => i !== item);
      }
      this.internalValue = newValue;
    },
  },
});
</script>
