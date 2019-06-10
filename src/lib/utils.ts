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
