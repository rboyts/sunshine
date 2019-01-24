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

export interface ILoadItemsPayload {
  skip: number;
  take: number;
}

export interface ILoadSubItemsPayload extends ILoadItemsPayload {
  keyPath: string[];
}

export interface ILoadResult {
  items: IItem[];
  total: number | null;
}

export interface IRequestLoadItemsPayload {
  firstRow: number;
  lastRow: number;
  clear?: boolean;
}

export interface IMonth {
  daysInMonth: number;
  firstDay: number;
  lastDay: number;
  month: number;
  previousMonthDays: number[];
  weeksInMonth: number[];
}
