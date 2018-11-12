export interface ISortState {
  key: string | null;
  reverse: boolean;
}

export interface IColumn {
  key: string;
  title: string;
  sortable?: boolean;
  export?: boolean;
}

export interface IItem {
  [key: string]: any;
}

export type FetchData = (skip: number, take: number, sorting: ISortState) => Promise<IItem[]>;

export interface IDataSource {
  title: string;
  columns: IColumn[];
  fetch: FetchData;
  count: number | null;
}
