import Vue from 'vue';

interface IClasses {
  [key: string]: boolean;
}

export const toKebabCase = (name: string): string => name.replace(/([A-Za-z])([A-Z])/g, '$1-$2').toLowerCase();

const getBaseClass = (vm: Vue): string => {
  const opts = vm.$options as any;
  if ('$_className' in opts) {
    return opts.$_className;
  } else if (vm.$options.name) {
    return toKebabCase(vm.$options.name);
  } else {
    console.error('$class helper used in component without "name".');
    return 'name-not-specified';
  }
};

const getClassObject = (names: string[], options: IClasses): IClasses => {
  const fullName = names.join('__');
  let res = { [fullName]: true };
  for (let key of Object.keys(options)) {
    res[`${fullName}--${key}`] = options[key];
  }
  return res;
};

export interface IClassHelper {
  (this: Vue, ...args: string[]): IClasses;
  (this: Vue, options: IClasses): IClasses;
  (this: Vue, e1: string, options: IClasses): IClasses;
  (this: Vue, e1: string, e2: string, options: IClasses): IClasses;
  (this: Vue, e1: string, e2: string, e3: string, options: IClasses): IClasses;
  (this: Vue, e1: string, e2: string, e3: string, e4: string, options: IClasses): IClasses;
}

const classHelper: IClassHelper = function classHelper(this: Vue, ...args: any[]) {
  let names = [getBaseClass(this)].concat(args);
  let options = {};
  let last = names[names.length - 1];
  if (typeof last === 'object') {
    names = names.slice(0, names.length - 1);
    options = last;
  }
  return getClassObject(names, options);
};

export default classHelper;
