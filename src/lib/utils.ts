
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
