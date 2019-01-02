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
      :isEmpty="text == ''"
      v-bind="$attrs"
      @click.native="onClick"
    >
      <input
        ref="input"
        class="s-input__input"
        type="text"
        :disabled="!search"
        :value="text"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
        @input="onInput"
      />

      <span :class="classes('caret', caretModifiers)" @click="onCaretClick" @mousedown="$event.preventDefault()">
        <i class="fas fa-caret-down" />
      </span>
    </s-base-input>

    <div slot="content" @mousedown="$event.preventDefault()">
      <s-list>
        <s-list-item
          v-for="(item, i) in itemValues"
          :key="i"
          :checkable="multiple"
          :checked="item.checked"
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
import SList from './SList.vue';
import SListItem from './SListItem.vue';
import SMenu from './SMenu.vue';
import SBaseInput from './SBaseInput.vue';

export default Vue.extend({
  name: 's-drop-down',

  components: {
    SList,
    SListItem,
    SMenu,
    SBaseInput,
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
      filter: null as string | null,
    };
  },

  watch: {
    hasFocus(val) {
      if (val) {
        this.isOpen = true;
      } else {
        this.filter = null;
      }
    },
  },

  computed: {
    caretModifiers(): object {
      return {open: this.isOpen};
    },

    filteredItems(): object[] {
      if (this.filter === null) return this.items;
      const flt = this.filter.toLocaleLowerCase();
      return this.items.filter((i: any) => i.title.toLocaleLowerCase().indexOf(flt) !== -1);
    },

    // TODO: Need proper :key values, so that filtering doesn't alter which item each line corresponds to

    itemValues(): object[] {
      return this.filteredItems.map(item => {
        let checked = this.multiple && this.value.includes(item);
        return {
          ...item,
          item,
          checked,
        };
      });
    },

    text(): string {
      if (this.filter !== null) return this.filter;
      if (!this.value) return '';

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
  },

  methods: {
    onClick(event: PointerEvent) {
      const el = this.$refs.input as HTMLElement;
      el.focus();

      if (this.isOpen && !this.search) {
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }
    },

    onCaretClick(event: PointerEvent) {
      this.isOpen = !this.isOpen;
      event.stopPropagation();
    },

    onItemChange(item: any, checked: boolean) {
      console.log('onItemChange');
      if (!this.multiple) return;

      const currentValue = this.value as object[] || [];
      let newValue: object[];
      if (checked) {
        newValue = currentValue.concat(item);
      } else {
        newValue = currentValue.filter(i => i !== item);
      }
      this.$emit('input', newValue);
      this.filter = null;
    },

    onItemClick(item: any) {
      if (this.multiple) return;
      this.$emit('input', item);
      this.filter = null;
      this.isOpen = false;
    },

    onInput(event: InputEvent) {
      const el = event.target as HTMLInputElement;
      this.filter = el.value;
    }
  },
});
</script>

