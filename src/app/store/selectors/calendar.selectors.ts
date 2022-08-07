import { createSelector } from '@ngrx/store';

import { IAppState } from '../reducers';
import { CalendarState } from './../reducers/calendar.reducers';

const getCalendarState = (state: IAppState) => state.calendar;

export const getSelectedRecipy = createSelector(getCalendarState, (state: CalendarState) => state.selectedRecipy);
export const getSelectedDay = createSelector(getCalendarState, (state: CalendarState) => state.selectedDay);
export const getaddToCartDateRange = createSelector(getCalendarState, (state: CalendarState) => state.addToCartDateRange);