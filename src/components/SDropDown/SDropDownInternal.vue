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
        <slot name="selected" v-bind="{ textValue, value: internalValue, toggleChecked }">
          <span v-if="textValue" :class="classes('label', { 'with-label': !!label })">
            {{ textValue }}
          </span>
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

    error: String,

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
        let checked = this.multiple && this.internalValue.includes(item.key);
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

      const getLabel = (key: string) => {
        const item = this.items.find(it => it.key === key) as any;
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

    getPreviousItem(key: string | null): string {
      let index = key == null ? -1 : this.items.findIndex(it => it.key === key);
      if (index === -1) index = this.items.length;
      return this.items[Math.max(0, index - 1)].key;
    },

    getNextItem(key: string | null): string {
      let index = key == null ? -1 : this.items.findIndex(it => it.key === key);
      return this.items[Math.min(index + 1, this.items.length - 1)].key;
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

    onItemClick(key: string) {
      if (!this.multiple) {
        this.internalValue = key;
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

    toggleChecked(key: string) {
      if (!this.multiple) throw new Error('Expected multiple to be true');

      const currentValue = this.internalValue as string[] || [];
      this.setChecked(key, currentValue.indexOf(key) === -1);
    },

    setChecked(key: string, checked: boolean) {
      if (!this.multiple) throw new Error('Expected multiple to be true');

      const currentValue = this.internalValue as string[] || [];
      let newValue: string[];
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
      this.$emit('update:filter', '');
    },
  },
});
</script>
