import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

import { CalendarActions, CalendarActionTypes } from '../actions/calendar.actions';

export interface CalendarState {
  selectedRecipy: Recipy | null;
  selectedDay: { day: Day; meal: string } | null;
  addToCartDateRange: { startDate: string; endDate: string } | null;
}

export const InitialCalendarState: CalendarState = {
  selectedRecipy: null,
  selectedDay: null,
  addToCartDateRange: null
};

export function CalendarReducers(
  state: CalendarState = InitialCalendarState,
  action: CalendarActions
): CalendarState {
  switch (action.type) {
    case CalendarActionTypes.SET_ADD_TO_CART_DATE_RANGE: {
      return {
        ...state,
        addToCartDateRange: action.date
      }
    }

    case CalendarActionTypes.SET_RECIPY_SELECTED: {
      return {
        ...state,
        selectedRecipy: action.recipy,
      };
    }
    case CalendarActionTypes.SET_DAY_SELECTED: {
      return {
        ...state,
        selectedDay: action.date,
      };
    }
    case CalendarActionTypes.RESET_CALENDAR_STATE: {
      return {
        ...state,
        selectedDay: null,
        selectedRecipy: null,
      };
    }
    default:
      return state;
  }
}
