export const get = (obj: any, path: string | string[], defaultValue?: any): any => {
  if (typeof path === 'string') {
    return get(obj, path.split('.'), defaultValue);
  }
  if (!obj || !path.length) return obj;
  const [first, ...rest] = path;

  if (Object.prototype.hasOwnProperty.call(obj, first)) {
    return get(obj[first], rest, defaultValue);
  } else {
    return defaultValue;
  }
};

export const joinKeyPath = (keyPath: string[]) => keyPath.join(':');

export const createWrappingArray = function* wrappingArray(array: Array<any>) {
  let index = 0;
  while (true) {
    if (index >= array.length) {
      index = 0;
    }
    yield array[index];
    index++;
  }
};
