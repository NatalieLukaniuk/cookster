import {
  ActionReducerMap,
} from '@ngrx/store';
import { InitialUiState, UiReducers, UiState } from './ui.reducer';

export interface IAppState {
  ui: UiState
}

export const InitialAppState: IAppState = {
  ui: InitialUiState
}

export const reducers: ActionReducerMap<IAppState, any> = {
  ui: UiReducers
};
