import { PlannerActions, PlannerActionTypes } from '../actions/planner.actions';
import { PlannerByDate } from './../../planner-reworked/models';
export interface PlannerState {
  currentPlanner: PlannerByDate | null;
}

export const InitialPlannerState: PlannerState = {
  currentPlanner: null,
};

export function PlannerReducers(
  state: PlannerState = InitialPlannerState,
  action: PlannerActions
): PlannerState {
  switch (action.type) {
    case PlannerActionTypes.SET_PLANNER: {
      return {
        ...state,
        currentPlanner: action.planner,
      };
    }

    case PlannerActionTypes.RESET_CURRENT_PLANNER_BY_DATE: {
      return {
        ...state,
        currentPlanner: null,
      };
    }
    default:
      return { ...state };
  }
}
