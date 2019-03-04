import { Moment } from 'moment';

export interface ISortState {
  key: string | null;
  reverse: boolean;
}

export interface ISelection {
  active: string | null;
  selected: string[];
  inverted: boolean;
}

export interface IDataModuleState {
  isLoading: boolean;
  offset: number;
  sorting: ISortState;
  filter: any[], // TODO type
  items: { [key: string]: IItem[] };
  total: number | null;
  columns: Array<{ key: string, visible: boolean }>,

  selection: ISelection;
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

export interface IColumns {
  columns: IColumn[],
}

export interface IOrderedColumn {
  column: IColumn;
  visible: boolean;
}

export interface IItemData {
  [key: string]: any;
}

export interface IItem {
  key: string;
  icon?: string;

  // Sub-items for hierarchical data tables.
  //
  // Empty or not defined means that no sub-items exists.
  // `null` means that sub-items are loaded asynchronously, and loadSubItems
  // must be implemented.
  subItems?: IItem[] | null;

  data: IItemData;
}

export interface ILoadItemsPayload {
  skip: number;
  take: number;
}

export type FetchData = (
  skip: number,
  take: number,
  sorting: ISortState,
) => Promise<ILoadResult>;
export type FetchChildren = (keyPath: string[]) => Promise<ILoadResult>;

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
  year: number;
}

export interface ICalendarPeriod {
  from: Moment;
  to: Moment;
}

export interface MouseWheelEvent extends MouseEvent {
  wheelDelta: number;
  wheelDeltaX: number;
  wheelDeltaY: number;
  initMouseWheelEvent(
    typeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean,
    viewArg: Window,
    detailArg: number,
    screenXArg: number,
    screenYArg: number,
    clientXArg: number,
    clientYArg: number,
    buttonArg: number,
    relatedTargetArg: EventTarget,
    modifiersListArg: string,
    wheelDeltaArg: number,
  ): void;
}

export const NO_SELECTION: ISelection = Object.freeze({
  active: null,
  selected: [],
  inverted: false,
});
