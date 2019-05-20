export const get = (obj: any, path: string | string[]): any => {
  if (typeof path === 'string') {
    return get(obj, path.split('.'));
  }
  if (!obj || !path.length) return obj;
  const [first, ...rest] = path;
  return get(obj[first], rest);
};

export const joinKeyPath = (keyPath: string[]) => keyPath.join(':');
