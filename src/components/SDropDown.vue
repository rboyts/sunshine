<template>
  <s-menu :value="hasFocus">
    <s-base-input
      slot="activator"
      :hasFocus="hasFocus"
      v-bind="$attrs"
      @click.native="onClick"
    >
      <input
        ref="input"
        class="s-input__input"
        type="text"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      />

      <span :class="caretClass">
        <i class="fas fa-caret-down" />
      </span>
    </s-base-input>

    <div slot="content" style="max-height:300px; overflow-y: auto">
      <s-list>
        <s-list-item>One</s-list-item>
        <s-list-item>Two</s-list-item>
        <s-list-item>Three</s-list-item>
        <s-list-item v-for="i in 30" :key="i">Item {{ i }}</s-list-item>
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
import { classHelper } from '../lib/utils';

const caretClassHelper = classHelper('s-drop-down', 'caret');

export default Vue.extend({
  name: 's-drop-down',

  components: {
    SList,
    SListItem,
    SMenu,
    SBaseInput,
  },

  data() {
    return {
      hasFocus: false,
      isOpen: true,
    };
  },

  computed: {
    caretClass(): object {
      return caretClassHelper({open: this.hasFocus});
    },
  },

  methods: {
    onClick(event: PointerEvent) {
      const el = this.$refs.input as HTMLElement;
      el.focus();
    },
  },
});
</script>

