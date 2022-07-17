import { Action } from '@ngrx/store';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';

import { Recipy } from './../../recipies/models/recipy.interface';

export enum CalendarActionTypes {
    SET_RECIPY_SELECTED = '[CALENDAR] Set Recipy Selected',
    SET_DAY_SELECTED = '[CALENDAR] Set Day Selected',
    RESET_CALENDAR_STATE = '[CALENDAR] Reset Calendar State'
}

export class SetRecipySelectedAction implements Action {
    readonly type = CalendarActionTypes.SET_RECIPY_SELECTED;
    constructor(public recipy: Recipy){}
}

export class SetDaySelectedAction implements Action {
    readonly type = CalendarActionTypes.SET_DAY_SELECTED;
    constructor(public date: {day: Day, meal: string}){}
}

export class ResetCalendarStateAction implements Action {
    readonly type = CalendarActionTypes.RESET_CALENDAR_STATE;
    constructor(){}
}

export type CalendarActions = SetDaySelectedAction | SetRecipySelectedAction | ResetCalendarStateAction;