<template>
  <s-menu
    v-model="isOpen"
    :left="left"
  >
    <template v-slot:activator>
      <slot>
        <s-button round>
          <s-icon
            package="sunshine24"
            name="more"
          />
        </s-button>
      </slot>
    </template>

    <template v-slot:content>
      <s-menu-list>
        <s-list-item
          v-for="(item, i) in items"
          :key="item.key || i"
          :checkable="item.checkable"
          @change="checked => {
            if (item.onChange) item.onChange(checked);
          }"
          @click="() => {
            if (item.onClick) item.onClick();
            isOpen = false;
          }"
        >
          {{ item.label }}
        </s-list-item>
      </s-menu-list>
    </template>
  </s-menu>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'SMenuBuilder',

  props: {
    items: {
      type: Array,
      required: true,
    },

    left: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isOpen: false,
    };
  },
});
</script>
