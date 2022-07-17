import { ActionReducerMap } from '@ngrx/store';

import { CalendarReducers, CalendarState, InitialCalendarState } from './calendar.reducers';
import { FiltersReducers, FiltersState, InitialFiltersState } from './filters.reducers';
import { InitialUiState, UiReducers, UiState } from './ui.reducer';

export interface IAppState {
  ui: UiState,
  filters: FiltersState,
  calendar: CalendarState
}

export const InitialAppState: IAppState = {
  ui: InitialUiState,
  filters: InitialFiltersState,
  calendar: InitialCalendarState
}

export const reducers: ActionReducerMap<IAppState, any> = {
  ui: UiReducers,
  filters: FiltersReducers,
  calendar: CalendarReducers
};
