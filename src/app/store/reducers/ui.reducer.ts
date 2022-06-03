import { UiActions, UiActionTypes } from "../actions/ui.actions";
import { InitialUserState } from "./user.reducer";

export interface UiState {
    isLoading: boolean;
    successMessage: string | null;
    error: any | null;
    isSidebarOpen: boolean;
}

export const InitialUiState: UiState = {
    isLoading: false,
    successMessage: null,
    error: null,
    isSidebarOpen: false
}

export function UiReducers(state: UiState = InitialUiState, action: UiActions): UiState {
    switch (action.type) {
        case UiActionTypes.SET_IS_LOADING_TRUE: {
            return {
                ...state,
                isLoading: true
            }
        }

        case UiActionTypes.SET_IS_LOADING_FALSE: {
            return {
                ...state,
                isLoading: false
            }
        }
        case UiActionTypes.SHOW_SUCCESS_MESSAGE: {
            return {
                ...state,
                successMessage: action.message
            }
        }
        case UiActionTypes.DISMISS_SUCCESS_MESSAGE: {
            return {
                ...state,
                successMessage: null
            }
        }

        case UiActionTypes.SET_ERROR: {
            return {
                ...state,
                error: action.details
            }
        }

        case UiActionTypes.RESET_ERROR: {
            return {
                ...state,
                error: null
            }
        }

        case UiActionTypes.SET_IS_SIDEBAR_OPEN: {
            return {
                ...state,
                isSidebarOpen: action.isSidebarOpen
            }
        }
        default: return { ...state }
    }
}