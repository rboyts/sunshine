
type ClassObj = {[key: string]: boolean};

// export function classHelper(name: string, options: ClassObj): ClassObj;
// export function classHelper(name: string, element1: string, options: ClassObj): ClassObj;
// export function classHelper(name: string, element1: string, element2: string, options: ClassObj): ClassObj;
// export function classHelper(name: string, element1: string, element2: string, element3: string, options: ClassObj): ClassObj;

// export function classHelper(name: string, ...args: any[]): ClassObj {
//   let elements = args.slice(0, args.length - 1) as string[];
//   let options = args[args.length - 1] as ClassObj;
//   let fullName = [name].concat(elements).join('__');
//   let res = { [fullName]: true };
//   for (let key of Object.keys(options)) {
//     res[`${fullName}--${key}`] = options[key];
//   }
//   return res;
// }

// classHelper
//   .b('ui-btn')
//   .e('content')
//   .m({
//     small: this.small,
//     disabled: this.disabled,
//   });

interface IClassHelper {
  elem: (elementName: string) => IClassHelper;
  gen: (options: ClassObj) => ClassObj;
}

const _gen = (name: string, options: ClassObj) => {
  let res = { [name]: true };
  for (let key of Object.keys(options)) {
    res[`${name}--${key}`] = options[key];
  }
  return res;
};

export const generate = (name: string): IClassHelper => ({
  elem: (elementName: string) => generate(`${name}__${elementName}`),
  gen: (options: ClassObj) => _gen(name, options),
});
