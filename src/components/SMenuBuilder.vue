<template>
  <s-menu-list>
    <s-list-item
      v-for="(item, i) in items"
      :key="item.key || i"
      :checkable="item.checkable"
      :checked="item.checked"
      @change="checked => {
        if (item.onChange) item.onChange(checked);
        $emit('onChange', item, checked);
      }"
      @click="() => {
        if (item.onClick) item.onClick();
        $emit('onClick', item);
      }"
    >
      {{ item.label }}
    </s-list-item>
  </s-menu-list>
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
  },
});
</script>
