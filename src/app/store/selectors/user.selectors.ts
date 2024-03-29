import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IUserState } from '../reducers/user.reducer';

export const FeatureName = 'user';
export const getUserState = createFeatureSelector<IUserState>(FeatureName);
export const getCurrentUser = createSelector(
  getUserState,
  (state) => state.currentUser
);
export const getUserPlannedRecipies = createSelector(
  getUserState,
  (state) => state.currentUser?.details
);

export const getUserPlanners = createSelector(getUserState, state => state.currentUser?.planner)
