import { ISortState, IItem, FetchData } from '@/components/types';
type BasicFetch = () => Promise<IItem[]>;

export default (next: BasicFetch): FetchData => (
  async (skip: number, take: number, sorting: ISortState) => {
    if (skip > 0) return [];

    let items: IItem[] = await next();

    if (sorting.key === null)
      return items;

    const { key, reverse } = sorting;

    const keyFunc = (item: IItem) => item[key];
    const sortFunc = (a: IItem, b: IItem) => {
      let keyA = keyFunc(a);
      let keyB = keyFunc(b);
      let v = reverse ? 1 : -1;

      switch (true) {
        case keyA < keyB:
          return v;
        case keyA > keyB:
          return -v;
        default:
          return 1;
      }
    };

    return items.slice(skip).sort(sortFunc);
  }
);
