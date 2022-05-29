import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IAppState } from "../reducers";
import { IUserState } from "../reducers/user.reducer";

export const FeatureName = 'user';
export const getUserState = createFeatureSelector<IUserState>(FeatureName);
export const getCurrentUser = createSelector(getUserState, state => state.currentUser)