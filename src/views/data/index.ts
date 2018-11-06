import { IDataSource } from '@/components/types';

import jsonplaceholder from './jsonplaceholder';
import reqres from './reqres';
import github from './github';
import fake from './fake';
import empty from './empty';

const DataSources: IDataSource[] = [
  jsonplaceholder,
  reqres,
  github,
  empty,

  fake('Infinite rows'),
  fake('75 rows', 75),
  fake('999 rows', 999),
  fake('1000000 rows', 1000000),
];

export default DataSources;
