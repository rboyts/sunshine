import { ActionContext } from 'vuex';

export interface ISortState {
  key: string | null;
  reverse: boolean;
}

export interface IDataTableState {
  isLoading: boolean;
  offset: number;
  sorting: ISortState;
  items: {[key: string]: IItem[]};
  total: number | null;
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

export interface IFetchPayload {
  skip: number;
  take: number;
}

export interface IFetchResult {
  items: IItem[];
  total: number | null;
}

export type FetchData<RootState> = (skip: number, take: number, sorting: ISortState, context: ActionContext<IDataTableState, RootState>) => Promise<IFetchResult>;
export type FetchChildren = (keyPath: string[]) => Promise<IFetchResult>;

export interface ICreateDataModuleOptions<RootState> {
  columns: IColumn[];
  fetch: FetchData<RootState>;
  fetchChildren?: FetchChildren;
  chunkSize?: number;
}

export interface IFetchItemsPayload {
  firstRow: number;
  lastRow: number;
  clear: boolean;
  sorting: ISortState;
}

export interface IMonth {
  daysInMonth: number;
  firstDay: number;
  lastDay: number;
  month: number;
  previousMonthDays: number[];
  weeksInMonth: number[];
}
