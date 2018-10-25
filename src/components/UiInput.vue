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
