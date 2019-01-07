export interface ISortState {
  key: string | null;
  reverse: boolean;
}

export interface IColumn {
  key: string;
  title: string;
  sortable?: boolean;
  export?: boolean;
  width?: number;
  align?: 'left' | 'right' | 'center';
  filter?: (value: any) => any;
}

export interface IItemData {
  [key: string]: any;
}

export interface IItem {
  children?: IItem[];
  icon?: string;

  data: IItemData;
}

export interface IFetchResult {
  items: IItem[];
  total: number | null;
}

export type FetchData = (skip: number, take: number, sorting: ISortState) => Promise<IFetchResult>;

export interface IDataSource {
  title: string;
  outline?: boolean;
  fixed?: boolean;
  columns: IColumn[];
  fetch: FetchData;
}

export interface IDataTableState {
  // title: string,
  // outline: boolean;
  // fixed?: boolean;
  isLoading: boolean;
  skip: number;
  sorting: ISortState;
  columns: IColumn[];
  items: IItem[];
  total: number;
}

export interface IFetchItemsPayload {
  firstRow: number;
  lastRow: number;
  clear: boolean;
  sorting: ISortState;
}
