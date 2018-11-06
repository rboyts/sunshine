import { ISortState, IItem } from '@/components/types';

export default
  {
    title: 'reqres.in',
    columns: [
      { key: 'id', title: 'Id' },
      { key: 'first_name', title: 'First name' },
      { key: 'last_name', title: 'Lase name' },
      { key: 'avatar', title: 'Avatar' },
    ],
    count: null,
    fetch: async (skip = 0, sorting: ISortState): Promise<IItem[]> => {
      let page = Math.floor(skip / 10) + 1;
      let res = await fetch(`https://reqres.in/api/users?per_page=10&page=${page}`);
      return (await res.json()).data as IItem[];
    },
  };
