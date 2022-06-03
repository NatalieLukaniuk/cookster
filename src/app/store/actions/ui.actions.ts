import { Action } from "@ngrx/store";

export enum UiActionTypes {
    SET_IS_LOADING_TRUE = '[UI] Is Loading',
    SET_IS_LOADING_FALSE = '[UI] Loading Completed',
    SHOW_SUCCESS_MESSAGE = '[UI] Show Success Message',
    DISMISS_SUCCESS_MESSAGE = '[UI] Dismiss Success Message',
}

export class SetIsLoadingAction implements Action {
    readonly type = UiActionTypes.SET_IS_LOADING_TRUE;
    constructor() { }
}

export class SetIsLoadingFalseAction implements Action {
    readonly type = UiActionTypes.SET_IS_LOADING_FALSE;
    constructor() { }
}

export class ShowSuccessMessageAction implements Action {
    readonly type = UiActionTypes.SHOW_SUCCESS_MESSAGE;
    constructor(public message: string) { }
}

export class DismissSuccessMessageAction implements Action {
    readonly type = UiActionTypes.DISMISS_SUCCESS_MESSAGE;
    constructor() { }
}

export type UiActions = SetIsLoadingAction | SetIsLoadingFalseAction | ShowSuccessMessageAction | DismissSuccessMessageAction;