<template>
  <div>
    <slot />
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 's-radio-group',

  provide() {
    return {
      group: this,
    };
  },

  props: {
    value: String,
  },

  data() {
    return {
      internalValue: null,
    };
  },

  watch: {
    value: {
      handler(val) {
        this.internalValue = val;
      },
      immediate: true,
    },

    internalValue(val) {
      this.updateValues();
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },

  },

  methods: {
    register(radio) {
      this.$_radios.push(radio);

      const handler = () => {
        this.internalValue = radio.value;
      };

      radio.$on('change', handler);

      // Returns unregister callback
      return () => {
        radio.$off('change', handler);
        let index = this.$_radios.indexOf(radio);
        if (index !== -1) {
          this.$_radios.splice(index, 1);
        }
      };
    },

    updateValues() {
      for (let radio of this.$_radios) {
        radio.checked = radio.value === this.internalValue;
      }
    },
  },

  created() {
    this.$_radios = [];
  },

  mounted() {
    Vue.nextTick(() => this.updateValues());
  },
});
</script>
