import { ISortState, IItem } from '@/components/types';

export default
  {
    title: 'Github Repos',
    columns: [
      { key: 'full_name', title: 'Full name', sortable: true },
      { key: 'created_at', title: 'Created', sortable: true },
      { key: 'updated_at', title: 'Updated', sortable: true },
      { key: 'name', title: 'Name' },
      { key: 'stargazers_count', title: 'Stars' },
      { key: 'language', title: 'Language' },
      { key: 'homepage', title: 'Homepage' },
      { key: 'size', title: 'Size' },
      { key: 'description', title: 'Description' },
    ],
    count: null,
    fetch: async (skip = 0, sorting: ISortState): Promise<IItem[]> => {
      let direction = sorting.reverse ? 'desc' : 'asc';
      let sort = sorting.key;
      if (sort === 'created_at') sort = 'created';
      if (sort === 'updated_at') sort = 'updated';
      const page = Math.floor(skip / 30) + 1;
      let query = `sort=${sort}&direction=${direction}&page=${page}&per_page=30`;
      const res = await fetch(`https://api.github.com/users/vuejs/repos?${query}`);
      return await res.json() as IItem[];
    },
  };
