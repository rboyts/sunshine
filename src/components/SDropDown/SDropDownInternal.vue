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
        @click.native="onClick"
        @keydown.native.up.prevent="onArrowUp"
        @keydown.native.down.prevent="onArrowDown"
        @keydown.native.enter.prevent="onEnter"
        @keydown.native.esc.prevent="onEscape"
        @keydown.native.backspace="onBackspace"
        @keydown.native.space="onSpace"
        @mousedown.native="$event.preventDefault()"
      >
        <slot name="selected" v-bind="{ textValue, value: internalValue, toggleChecked }">
          <span v-if="textValue" :class="classes('label')">{{ textValue }}</span>
        </slot>

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
              onChange: checked => onItemChange(node.item, checked),
              onClick: () => onItemClick(node.item),
            }"
          >
            <s-list-item
              :key="node.key"
              :checkable="multiple"
              :checked="node.checked"
              @change="onItemChange(node.item, $event)"
              @click="onItemClick(node.item)"
            >
              {{ node[labelKey] }}
            </s-list-item>
          </slot>
        </template>
      </s-menu-list>
    </template>
  </s-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import SBaseInput from '../SBaseInput.vue';
import SListItem from '../SListItem.vue';
import SMenu from '../SMenu.vue';
import SMenuList from '../SMenuList.vue';
import { ClassesMixin } from '../../lib/utils';

interface IListItem {
  key: string;
  label: string;
}

const validateUniqueKeys = (val: IListItem[]) => (
  val.every((it: IListItem, index: number) => !!it.key &&
   val.findIndex((o: IListItem) => o.key === it.key) === index)
);

export default mixins(ClassesMixin).extend({
  name: 's-drop-down',
  inheritAttrs: false,

  components: {
    SBaseInput,
    SListItem,
    SMenu,
    SMenuList,
  },

  props: {
    label: String,

    items: {
      type: Array as () => IListItem[],
      validator: validateUniqueKeys,
    },

    filter: String,

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
    caretModifiers(): object {
      return { open: this.isOpen };
    },

    itemValues(): object[] {
      return this.items.map(item => {
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
      if (!this.multiple && this.search && this.isOpen) return '';

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

    onBackspace(event: KeyboardEvent) {
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

    onSpace(event: KeyboardEvent) {
      if (!this.isOpen) {
        this.isOpen = true;
      }
    },

    getPreviousItem(item: IListItem | null): object {
      let index = item == null ? -1 : this.items.indexOf(item);
      if (index === -1) index = this.items.length;
      return this.items[Math.max(0, index - 1)];
    },

    getNextItem(item: IListItem | null): object {
      let index = item == null ? -1 : this.items.indexOf(item);
      return this.items[Math.min(index + 1, this.items.length - 1)];
    },

    onCaretClick(event: PointerEvent) {
      if (this.inactive) return;

      this.isOpen = !this.isOpen;
      event.stopPropagation();
    },

    onItemChange(item: any, checked: boolean) {
      if (!this.multiple) return;

      this.setChecked(item, checked);

      this.clearFilter();
    },

    onItemClick(item: any) {
      if (!this.multiple) {
        this.internalValue = item;
      }

      this.clearFilter();
      this.isOpen = false;
    },

    async onInput(event: InputEvent) {
      const el = event.target as HTMLInputElement;
      const val = el.value;
      if (val.length) {
        this.isOpen = true;
        await Vue.nextTick();
      }
      this.$emit('update:filter', val);
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

    clearFilter() {
      this.$emit('update:filter', '');
    },
  },
});
</script>
