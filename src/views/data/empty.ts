import { IItem } from '@/components/types';

export default
  {
    title: 'Empty',
    count: null,
    columns: [
      { key: 'id', title: 'Id' },
      { key: 'name', title: 'Name' },
    ],
    fetch: async (): Promise<IItem[]> => [],
  };
