import { Moment } from 'moment';

export interface IVisibleRowsPayload {
  firstRow: Number;
  lastRow: Number;
}

export interface ISortingState {
  key: string | null;
  reverse: boolean;
}

export interface ISelection {
  selected: string[];
  inverted: boolean;
}

export interface IColumn {
  key: string;
  title: string;
  sortable?: boolean;
  export?: boolean;
  hidden?: boolean;
  width?: number;
  align?: 'left' | 'right' | 'center';
  filter?: (value: any) => any;
}

export interface IColumns {
  columns: IColumn[],
}

export interface IColumnState {
  key: string;
  visible: boolean;
}

export interface IOrderedColumn {
  column: IColumn;
  visible: boolean;
}

export interface IItemData {
  [key: string]: any;
}

export interface IItem {
  id: string;
  icon?: string;

  // Sub-items for hierarchical data tables.
  //
  // Empty or not defined means that no sub-items exists.
  // `null` means that sub-items are loaded asynchronously, and loadSubItems
  // must be implemented.
  subItems?: IItem[] | null;

  data: IItemData;
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
  from: Moment | null;
  to: Moment | null;
}

export interface IMomentPayload {
  y: number,
  M: number,
  d: number
}

export enum CalendarOption {
  Previous = 'Previous',
  Current = 'Current',
  Next = 'Next',
}

export enum CalendarPeriod {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
}

export interface IDateRangePreset {
  option: CalendarOption,
  period: CalendarPeriod,
}

export interface IDateRangeValue {
  from: Moment | null;
  to: Moment | null;
  preset: IDateRangePreset | null;
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
  selected: [],
  inverted: false,
});
