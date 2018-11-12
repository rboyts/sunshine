import { ISortState, IItem } from '@/components/types';

const data = {
  names: ['Leanne Graham', 'Ervin Howell', 'Clementine Bauch', 'Patricia Lebsack',
    'Chelsey Dietrich', 'Mrs. Dennis Schulist', 'Kurtis Weissnat',
    'Nicholas Runolfsdottir V', 'Glenna Reichert', 'Clementina DuBuque'],
  emails: ['Sincere@april.biz', 'Shanna@melissa.tv', 'Nathan@yesenia.net',
    'Julianne.OConner@kory.org', 'Lucio_Hettinger@annie.ca',
    'Karley_Dach@jasper.info', 'Telly.Hoeger@billy.biz',
    'Sherwood@rosamond.me', 'Chaim_McDermott@dana.io',
    'Rey.Padberg@karina.biz'],
  phones: ['1-770-736-8031 x56442', '010-692-6593 x09125', '1-463-123-4447',
    '493-170-9623 x156', '(254)954-1289', '1-477-935-8478 x6430',
    '210.067.6132', '586.493.6943 x140', '(775)976-6794 x41206',
    '024-648-3804'],
  companies: ['Romaguera-Crona', 'Deckow-Crist', 'Romaguera-Jacobson',
    'Robel-Corkery', 'Keebler LLC', 'Considine-Lockman', 'Johns Group',
    'Abernathy Group', 'Yost and Sons', 'Hoeger LLC'],
  streets: ['Kulas Light', 'Victor Plains', 'Douglas Extension', 'Hoeger Mall',
    'Skiles Walks', 'Norberto Crossing', 'Rex Trail', 'Ellsworth Summit',
    'Dayna Park', 'Kattie Turnpike'],
  cities: ['Gwenborough', 'Wisokyburgh', 'McKenziehaven', 'South Elvis',
    'Roscoeview', 'South Christy', 'Howemouth', 'Aliyaview', 'Bartholomebury',
    'Lebsackbury'],
  zipcodes: ['92998-3874', '90566-7771', '59590-4157', '53919-4257', '33263',
    '23505-1337', '58804-1099', '45169', '76495-3109', '31428-2261'],
  suites: ['Apt. 556', 'Suite 879', 'Suite 847', 'Apt. 692', 'Suite 351',
    'Apt. 950', 'Suite 280', 'Suite 729', 'Suite 449', 'Suite 198'],
  websites: ['hildegard.org', 'anastasia.net', 'ramiro.info', 'kale.biz',
    'demarco.info', 'ola.org', 'elvis.io', 'jacynthe.com', 'conrad.com',
    'ambrose.net'],
};

export default (title: string, count: number | null = null) => ({
  title,
  columns: [
    { key: 'id', title: '#' },
    { key: 'number', title: 'Number' },
    { key: 'name', title: 'Name' },
    { key: 'company', title: 'Company' },
    { key: 'email', title: 'Email' },
    { key: 'suite', title: 'Suite' },
    { key: 'street', title: 'Street' },
    { key: 'zipcode', title: 'Zip-code' },
    { key: 'city', title: 'City' },
    { key: 'phone', title: 'Phone' },
    { key: 'website', title: 'Website' },
  ],

  count,

  fetch: async (skip = 0, take = 0, sorting: ISortState): Promise<IItem[]> => {
    const items: IItem[] = [];

    for (let i = 0; i < take; i++) {
      let id = skip + i;
      if (count && id >= count) break;

      items[i] = {
        id: id + 1,
        number: id * 100 + id + 1,
        name: data.names[id % data.names.length],
        company: data.companies[id * 3 % data.companies.length],
        phone: data.phones[id * 5 % data.phones.length],
        email: data.emails[id * 7 % data.emails.length],
        street: data.streets[id * 11 % data.emails.length],
        suite: data.suites[id * 13 % data.suites.length],
        zipcode: data.zipcodes[id * 3 % data.zipcodes.length],
        city: data.cities[id * 17 % data.suites.length],
        website: data.websites[id * 7 % data.zipcodes.length],
      };
    }

    return items;
  },
});
