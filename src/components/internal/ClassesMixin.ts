import Vue from 'vue';
import { classHelper, toKebabCase } from '../../lib/utils';

export default Vue.extend({
  computed: {
    $_baseClass(): string {
      const opts = this.$options as any;
      if ('$_className' in opts) {
        return opts.$_className;
      } else if (this.$options.name) {
        return toKebabCase(this.$options.name);
      } else {
        console.error('ClassesMixin used in component without "name".');
        return 'name-not-specified';
      }
    },
  },

  methods: {
    classes(...args: any[]) {
      let names = [this.$_baseClass].concat(args);
      let options = {};
      let last = names[names.length - 1];
      if (typeof last === 'object') {
        names = names.slice(0, names.length - 1);
        options = last;
      }
      return classHelper(...names)(options);
    },
  },
});
