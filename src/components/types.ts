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
  isOpen?: boolean;

  data: IItemData;
}

export type FetchData = (skip: number, take: number, sorting: ISortState) => Promise<IItem[]>;

export interface IDataSource {
  title: string;
  outline?: boolean;
  fixed?: boolean;
  columns: IColumn[];
  fetch: FetchData;
  count: number | null;
}
