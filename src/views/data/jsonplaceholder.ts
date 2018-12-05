import { IItem } from '@/components/types';
import createBasicSort from './createBasicSort';

export default
  {
    title: 'Users',
    columns: [
      { key: 'name', title: 'Name', sortable: true },
      { key: 'username', title: 'User name', sortable: true },
      { key: 'company', title: 'Company' },
      { key: 'email', title: 'Email', sortable: true },
      { key: 'suite', title: 'Suite' },
      { key: 'street', title: 'Street' },
      { key: 'zipcode', title: 'Zip-code' },
      { key: 'city', title: 'City' },
      { key: 'phone', title: 'Phone' },
      { key: 'website', title: 'Website' },
      { key: 'actions', title: 'Actions', export: false },
    ],
    count: 12,
    fetch: createBasicSort(async (): Promise<IItem[]> => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      return data.map((u: any) => ({
        data: {
          ...u,
          ...u.address,
          company: u.company.name,
        },
      }));
    }),
  };
