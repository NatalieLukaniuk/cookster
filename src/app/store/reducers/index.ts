import { ActionReducerMap } from '@ngrx/store';

import * as fromAppReducer from '../app.reducer';

export interface State {
  app: fromAppReducer.State;
}

export const reducers: ActionReducerMap<State, any> = {
  app: fromAppReducer.reducer,
};

