import Vue from 'vue';

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

export const ClassesMixin = Vue.extend({
  methods: {
    classes(...args: any[]): object {
      let names: any[] = [this.$options.name].concat(args);
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
