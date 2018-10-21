<template>
  <div
    class="ui-input"
    :class="{'ui-input--focus': hasFocus}"
  >
    <span
      class="ui-input--label"
      :class="{'ui-input--label-aside': hasFocus || hasText}"
    >
      {{ label }}
    </span>

    <input
      class="ui-input--input"
      v-model="text"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ui-input',

  props: {
    label: String,
  },

  data() {
    return {
      text: '',
      hasFocus: false,
    };
  },

  computed: {
    hasText(): boolean {
      return this.text !== '';
    }
  },

});
</script>

<style lang="scss" scoped>

.ui-input {
  position: relative;
  border: 2px solid #999;
  border-radius: 3px;
  background-color: #fff;
  min-width: 150px;
  max-width: 250px;
  margin-bottom: 4px;

  &.ui-input--focus,
  &:hover {
    border: 2px solid #666;
  }
}

.ui-input--label {
  position: absolute;
  top: 7px;
  transform-origin: 0 0;
  transition: transform .3s;
  color: #666;
  padding-left: 4px;
  pointer-events: none;

  &.ui-input--label-aside {
    transform: scale(.7) translate(0, -8px);
  }
}

.ui-input--input {
  width: 100%;
  border: none;
  outline: none;
  padding: 16px 4px 4px 4px;
}

</style>
