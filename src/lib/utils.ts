
interface ClassObj {
  [key: string]: boolean;
}

interface IClassHelper {
  elem: (elementName: string) => IClassHelper;
  apply: (options: ClassObj) => ClassObj;
}

const apply = (name: string, options: ClassObj) => {
  let res = { [name]: true };
  for (let key of Object.keys(options)) {
    res[`${name}--${key}`] = options[key];
  }
  return res;
};

export const classHelper = (name: string): IClassHelper => ({
  elem: (elementName: string) => classHelper(`${name}__${elementName}`),
  apply: (options: ClassObj) => apply(name, options),
});
