import Vue from 'vue';

export const get = (obj: any, path: string | string[]): any => {
  if (typeof path === 'string') {
    return get(obj, path.split('.'));
  }
  if (!obj || !path.length) return obj;
  const [first, ...rest] = path;
  return get(obj[first], rest);
};

export const joinKeyPath = (keyPath: string[]) => keyPath.join(':');

interface IClasses {
  [key: string]: boolean;
}

type Generate = (options: IClasses) => IClasses;

const apply = (name: string, options: IClasses): IClasses => {
  let res = { [name]: true };
  for (let key of Object.keys(options)) {
    res[`${name}--${key}`] = options[key];
  }
  return res;
};

export const classHelper = (...name: string[]): Generate => {
  const fullName = name.join('__');
  return (options: IClasses) => apply(fullName, options);
};

export const toKebabCase = (name: string): string => name.replace(/([A-Za-z])([A-Z])/g, '$1-$2').toLowerCase();

export const ClassesMixin = Vue.extend({
  computed: {
    $_baseClass(): string {
      if ('$_className' in this.$options) {
        return this.$options.$_className;
      } else if (this.$options.name) {
        return toKebabCase(this.$options.name);
      } else {
        console.error('ClassesMixin used in component without "name".');
        return 'name-not-specified';
      }
    },
  },

  methods: {
    classes(...args: any[]): object {
      let names: any[] = [this.$_baseClass].concat(args);
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
