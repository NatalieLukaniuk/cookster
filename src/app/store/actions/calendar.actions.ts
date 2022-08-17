import { Action } from '@ngrx/store';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';

import { Recipy } from './../../recipies/models/recipy.interface';

export enum CalendarActionTypes {
  SET_RECIPY_SELECTED = '[CALENDAR] Set Recipy Selected',
  SET_DAY_SELECTED = '[CALENDAR] Set Day Selected',
  RESET_CALENDAR_STATE = '[CALENDAR] Reset Calendar State',
  SET_ADD_TO_CART_DATE_RANGE = '[CALENDAR] Set Add To Cart Range Selected',
  RESET_ADD_TO_CART_DATE_RANGE = '[CALENDAR] Add To Cart Range Reset',
  PREVIEW_RECIPY = '[CLANEDAR] Preview Recipy',
  RESET_PREVIEW_RECIPY = '[CLANEDAR] Reset Preview Recipy',
  LOAD_CALENDAR = '[CLANEDAR] Load Calendar',
}

export class LoadCalendarAction implements Action {
  readonly type = CalendarActionTypes.LOAD_CALENDAR;
  constructor(public calendar: Day[]){}
}

export class PreviewRecipyAction implements Action {
  readonly type = CalendarActionTypes.PREVIEW_RECIPY;
  constructor(
    public recipy: Recipy,
    public portions: number,
    public amountPerPortion: number
  ) {}
}

export class ResetPreviewRecipyAction implements Action {
  readonly type = CalendarActionTypes.RESET_PREVIEW_RECIPY;
  constructor() {}
}
export class AddToCartRangeResetAction implements Action {
  readonly type = CalendarActionTypes.RESET_ADD_TO_CART_DATE_RANGE;
  constructor() {}
}
export class SetAddToCartRangeSelected implements Action {
  readonly type = CalendarActionTypes.SET_ADD_TO_CART_DATE_RANGE;
  constructor(public date: { startDate: string; endDate: string }) {}
}

export class SetRecipySelectedAction implements Action {
  readonly type = CalendarActionTypes.SET_RECIPY_SELECTED;
  constructor(public recipy: Recipy) {}
}

export class SetDaySelectedAction implements Action {
  readonly type = CalendarActionTypes.SET_DAY_SELECTED;
  constructor(public date: { day: Day; meal: string }) {}
}

export class ResetCalendarStateAction implements Action {
  readonly type = CalendarActionTypes.RESET_CALENDAR_STATE;
  constructor() {}
}

export type CalendarActions =
  | SetDaySelectedAction
  | SetRecipySelectedAction
  | ResetCalendarStateAction
  | SetAddToCartRangeSelected
  | AddToCartRangeResetAction
  | PreviewRecipyAction
  | ResetPreviewRecipyAction | LoadCalendarAction;
