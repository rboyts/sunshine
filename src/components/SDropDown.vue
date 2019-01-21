<!--

Use cases:

- Simple drop-down (no keyboard input, just select one of multiple available options)
- Drop-down with search (use keyboard input only to filter available options, not possible to input arbitrary text)
- Auto-complete (list is initially empty, only shows suggestions when partial text is entered)
- Multi-select (items have checkbox, input shows comma separated list or "N items selected")
- Multi-select with search
- Search/create new when not found?

-->


<template>
  <s-menu v-model="isOpen" :class="classes()" :toggleOnClick="false">
    <s-base-input
      slot="activator"
      :class="classes('input')"
      :hasFocus="hasFocus"
      :isEmpty="textValue == '' && text == ''"
      :readonly="!search"
      v-bind="$attrs"
      @click.native="onClick"
      @keydown.native="onKeyDown"
      @mousedown.native="$event.preventDefault()"
    >
      <label v-if="textValue" :class="classes('label')">{{ textValue }}</label>

      <input
        v-if="search"
        ref="input"
        class="s-input__input"
        type="text"
        :value="filter"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        @input="onInput"
      />

      <div
        v-else
        ref="input"
        :class="classes('spacer')"
        tabIndex="0"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      />

      <s-svg name="dropdownArrow" :class="classes('caret', caretModifiers)" @click.native="onCaretClick" />
    </s-base-input>

    <div slot="content" @mousedown="$event.preventDefault()">
      <s-list>
        <s-list-item
          v-for="item in itemValues"
          :key="item.key"
          :checkable="multiple"
          :checked="item.checked"
          :selected="item.selected"
          @change="onItemChange(item.item, $event)"
          @click="onItemClick(item.item)"
        >
          {{ item.title }}
        </s-list-item>
      </s-list>
    </div>
  </s-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import SList from './SList.vue';
import SListItem from './SListItem.vue';
import SMenu from './SMenu.vue';
import SBaseInput from './SBaseInput.vue';
import SSvg from './internal/SSvg.vue';
import { ClassesMixin } from '../lib/utils';

export default mixins(ClassesMixin).extend({
  name: 's-drop-down',

  components: {
    SList,
    SListItem,
    SMenu,
    SBaseInput,
    SSvg,
  },

  props: {
    items: Array as () => object[],

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
  },

  data() {
    return {
      hasFocus: false,
      isOpen: false,
      filter: '',
      selected: null as object | null,
    };
  },

  watch: {
    hasFocus(val) {
      if (!val) {
        this.isOpen = false;
      }
    },

    isOpen(val) {
      if (!val) {
        this.filter = '';
        this.selected = null;
      }
    },

    filteredItems(val) {
      // Unselect if the selected item becomes hidden by filter
      if (this.selected) {
        if (val.indexOf(this.selected) === -1) {
          this.selected = null;
        }
      }

      if (this.isOpen && val.length && !this.selected) {
        this.selected = val[0];
      }
    },
  },

  computed: {
    caretModifiers(): object {
      return {open: this.isOpen};
    },

    filteredItems(): object[] {
      if (!this.filter) return this.items;
      const flt = this.filter.toLocaleLowerCase();
      return this.items.filter((i: any) => i.title.toLocaleLowerCase().indexOf(flt) !== -1);
    },

    // TODO: Need proper :key values, so that filtering doesn't alter which item each line corresponds to

    itemValues(): object[] {
      return this.filteredItems.map(item => {
        let checked = this.multiple && this.value.includes(item);
        let selected = this.selected === item;
        return {
          ...item,
          item,
          checked,
          selected,
        };
      });
    },

    text(): string {
      return this.filter || '';
    },

    textValue(): string {
      if (!this.value) return '';

      // Hide when typing in single-select mode
      if (!this.multiple && this.filter) return '';

      if (this.multiple) {
        if (this.value.length > this.maxSelectedShown) {
          // TODO customize/i18n
          return `${this.value.length} selected`;
        } else {
          return this.value.map((v: any) => v.title).join(', ');
        }
      } else {
        return this.value.title;
      }
    },

    labels(): string[] {
      if (!this.multiple) return [];

      if (this.value.length > this.maxSelectedShown) {
        return [`${this.value.length} selected`];
      } else {
        return this.value.map((v: any) => v.title);
      }
    },
  },

  methods: {
    onClick(event: PointerEvent) {
      if (this.isOpen && !this.search) {
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }

      const el = this.$refs.input as HTMLElement;
      el.focus();
    },

    onKeyDown(event: KeyboardEvent) {
      let consumed = false;

      if (this.isOpen) {
        switch (event.key) {
          case 'ArrowUp':
            this.selectPrevious();
            consumed = true;
            break;
          case 'ArrowDown':
            this.selectNext();
            consumed = true;
            break;
          case 'Enter':
            if (this.selected) {
              if (this.multiple) {
                this.setChecked(this.selected, true);
              } else {
                this.setValue(this.selected);
              }
              this.isOpen = false;
            }
            consumed = true;
            break;
          case ' ':
            if (this.selected) {
              if (this.multiple) {
                this.toggleChecked(this.selected);
                this.filter = '';
                consumed = true;
              }
            }
            break;
          case 'Backspace':
            if (!this.filter) {
              if (this.multiple) {
                this.value.pop();
                consumed = true;
              }
            }
            break;
          case 'Escape':
            if (this.filter) {
              this.filter = '';
            } else {
              this.isOpen = false;
            }
            consumed = true;
        }
      } else {
        switch (event.key) {
          case 'ArrowDown':
            if (this.multiple) {
              this.isOpen = true;
              this.selectNext();
            } else {
              this.setValue(this.getNextItem(this.value));
            }
            consumed = true;
            break;
          case 'ArrowUp':
            if (this.multiple) {
              this.isOpen = true;
              this.selectPrevious();
            } else {
              this.setValue(this.getPreviousItem(this.value));
            }
            consumed = true;
            break;
          case 'Enter':
          case 'Backspace':
          case ' ':
            this.isOpen = true;
            consumed = true;
            break;
        }
      }

      if (consumed) {
        event.preventDefault();
      }
    },

    selectPrevious() {
      this.selected = this.getPreviousItem(this.selected);
    },

    selectNext() {
      this.selected = this.getNextItem(this.selected);
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
      this.isOpen = !this.isOpen;
      event.stopPropagation();
    },

    onItemChange(item: any, checked: boolean) {
      if (!this.multiple) return;

      this.setChecked(item, checked);
      this.filter = '';
    },

    onItemClick(item: any) {
      if (this.multiple) return;
      this.setValue(item);
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

      const currentValue = this.value as object[] || [];
      this.setChecked(item, currentValue.indexOf(item) === -1);
    },

    setChecked(item: any, checked: boolean) {
      if (!this.multiple) throw new Error('Expected multiple to be true');

      const currentValue = this.value as object[] || [];
      let newValue: object[];
      if (checked) {
        newValue = (currentValue.indexOf(item) === -1) ? currentValue.concat(item) : currentValue;
      } else {
        newValue = currentValue.filter(i => i !== item);
      }
      this.setValue(newValue);
    },

    setValue(value: any) {
      this.$emit('input', value);
    },
  },
});
</script>

