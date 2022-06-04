import {
  ActionReducerMap,
} from '@ngrx/store';
import { FiltersReducers, FiltersState, InitialFiltersState } from './filters.reducers';
import { InitialUiState, UiReducers, UiState } from './ui.reducer';

export interface IAppState {
  ui: UiState,
  filters: FiltersState
}

export const InitialAppState: IAppState = {
  ui: InitialUiState,
  filters: InitialFiltersState
}

export const reducers: ActionReducerMap<IAppState, any> = {
  ui: UiReducers,
  filters: FiltersReducers
};
