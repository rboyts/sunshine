import { ISortState, IItem, IItemData } from '@/components/types';

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
    fetch: async (skip: number, take: number, sorting: ISortState): Promise<IItem[]> => {
      let page = Math.floor(skip / 10) + 1;
      let res = await fetch(`https://reqres.in/api/users?per_page=${take}&page=${page}`);
      let content = await res.json();
      return content.data.map((data: IItemData) => ({data}));
    },
  };
