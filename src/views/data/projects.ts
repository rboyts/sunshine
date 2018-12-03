import { ISortState, IItem } from '@/components/types';

export default
  {
    title: 'Project list',
    columns: [
      { key: 'name', title: 'Name' },
      { key: 'number', title: 'Number' },
      { key: 'place', title: 'Place' },
      { key: 'department', title: 'Department' },
      { key: 'responsible', title: 'Responsible' },
      { key: 'ue_code', title: 'UE-code' },
      { key: 'calculated', title: 'Calculated' },
      { key: 'hours', title: 'Hours' },
      { key: 'invoiced', title: 'Invoiced' },
    ],
    count: 3,
    fetch: async (skip: number, take: number, sorting: ISortState): Promise<IItem[]> => {
      return [
        {
          icon: 'fas fa-suitcase',
          data: {
            name: 'First project',
            number: '5124',
            place: 'Vibes gate 18C',
            department: 'Department A',
            responsible: 'Hans Hansen',
            ue_code: 'K6tUf2',
            calculated: 2000,
            hours: 1234,
            invoiced: 760,
          },

          _children: [
            {
              icon: 'far fa-folder',
              data: {
                name: 'Underprosjekt 1',
                number: '5124-1',
                place: 'Vibes gate 18C',
                department: 'Department A',
                responsible: 'Per Jensen',
                ue_code: 'di2Skd',
                calculated: 800,
                hours: 450,
                invoiced: 250,
              },

              _children: [
                {
                  icon: 'far fa-circle',
                  data: {
                    name: 'Område 1',
                    number: '5124-1100',
                    place: 'Kjeller',
                    department: 'Department A',
                    responsible: 'Pål Knutsen',
                    ue_code: '',
                    calculated: 0,
                    hours: 0,
                    invoiced: 0,
                  },

                  _children: [],
                },

                {
                  icon: 'far fa-circle',
                  data: {
                    name: 'Område 2',
                    number: '5124-1200',
                    place: 'Kjøkken',
                    department: 'Department A',
                    responsible: 'Erik Knutsen',
                    ue_code: '',
                    calculated: 0,
                    hours: 0,
                    invoiced: 0,
                  },

                  _children: [],
                },
              ],
            },
            {
              icon: 'far fa-folder',
              data: {
                name: 'Underprosjekt 2',
                number: '5124-1',
                place: 'Vibes gate 18C',
                department: 'Department A',
                responsible: 'Knut Knutsen',
                ue_code: 'toS3s9',
                calculated: 1200,
                hours: 700,
                invoiced: 400,
              },

              _children: [
                {
                  icon: 'far fa-circle',
                  data: {
                    name: 'Område 3',
                    number: '5124-1200',
                    place: 'Tak',
                    department: 'Department A',
                    responsible: 'Erik Knutsen',
                    ue_code: '',
                    calculated: 0,
                    hours: 0,
                    invoiced: 0,
                  },

                  _children: [],
                },

              ],
            },
          ],
        },

        {
          icon: 'fas fa-suitcase',
          data: {
            name: 'Second project',
            number: '5598',
            place: 'Vibes gate 18C',
            department: 'Department A',
            responsible: 'Hans Hansen',
            ue_code: '9adsSD',
            calculated: 4300,
            hours: 2330,
            invoiced: 0,
          },

          _children: [
            {
              icon: 'far fa-folder',
              data: {
                name: 'Underprosjektnavn',
                number: '5124-1',
                place: 'Vibes gate 18C',
                department: 'Department A',
                responsible: 'Hans Hansen',
                ue_code: '8fRks2',
                calculated: 1000,
                hours: 0,
                invoiced: 0,
              },

              _children: [],
            },
          ],
        },

        {
          icon: 'fas fa-suitcase',
          data: {
            name: 'Third project',
            number: '2934',
            place: 'Vibes gate 18C',
            department: 'Department A',
            responsible: 'Hans Hansen',
            ue_code: '2aK90d',
            calculated: 1200,
            hours: 500,
            invoiced: 200,
          },

          _children: [],
        },
      ];
    },
  };
