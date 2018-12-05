import { ISortState, IItem, IItemData } from '@/components/types';

export default
  {
    title: 'Github Repos',
    columns: [
      { key: 'full_name', title: 'Full name', sortable: true },
      { key: 'created_at', title: 'Created', sortable: true },
      { key: 'updated_at', title: 'Updated', sortable: true },
      { key: 'name', title: 'Name' },
      { key: 'stargazers_count', title: 'Stars', align: 'right' },
      { key: 'language', title: 'Language', align: 'center' },
      { key: 'homepage', title: 'Homepage' },
      { key: 'size', title: 'Size', align: 'right' },
      { key: 'description', title: 'Description' },
    ],
    count: null,
    fetch: async (skip = 0, take: number, sorting: ISortState): Promise<IItem[]> => {
      if (skip % take !== 0)
        console.warn(`Expected skip (${skip}) to be a multiple of take (${take})`);
      let direction = sorting.reverse ? 'desc' : 'asc';
      let sort = sorting.key;
      if (sort === 'created_at') sort = 'created';
      if (sort === 'updated_at') sort = 'updated';
      const page = Math.floor(skip / take) + 1;
      let query = `sort=${sort}&direction=${direction}&page=${page}&per_page=${take}`;
      const res = await fetch(`https://api.github.com/users/vuejs/repos?${query}`);
      const repos = await res.json() as IItemData[];

      return repos.map(data => ({data}));
    },
  };
