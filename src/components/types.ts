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
  key: string;
  icon?: string;
  totalChildren?: number;
  children?: IItem[] | null;

  data: IItemData;
}

export interface IFetchResult {
  items: IItem[];
  total: number | null;
}

export type FetchData = (skip: number, take: number, sorting: ISortState) => Promise<IFetchResult>;
export type FetchChildren = (keyPath: string[]) => Promise<IFetchResult>;

export interface ICreateDataModuleOptions {
  columns: IColumn[];
  fetch: FetchData;
  fetchChildren?: FetchChildren;
}

export interface IFetchItemsPayload {
  firstRow: number;
  lastRow: number;
  clear: boolean;
  sorting: ISortState;
}
