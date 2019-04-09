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
