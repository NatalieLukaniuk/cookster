import { Action } from "@ngrx/store";
import { NewRecipy, Recipy } from "src/app/recipies/models/recipy.interface";
import { RecipiesReducers } from "../reducers/recipies.reducer";

export enum RecipiesActionTypes {
    RECIPIES_LOADED = '[RECIPIES] Recipies Loaded',
    GET_RECIPIES = '[RECIPIES] Get Recipies',
    ADD_RECIPY = '[RECIPIES] Add New Recipy',
    ADD_RECIPY_SUCCESS = '[RECIPIES] New Recipy Has Been Added',
    UPDATE_RECIPY = '[RECIPIES] Update Recipy',
    UPDATE_RECIPY_SUCCESS = '[RECIPIES] Recipy Has Been Updated',
}

export class UpdateRecipyAction implements Action {
    readonly type = RecipiesActionTypes.UPDATE_RECIPY;
    constructor(public recipy: Recipy){}
}

export class UpdateRecipySuccessAction implements Action {
    readonly type = RecipiesActionTypes.UPDATE_RECIPY_SUCCESS;
    constructor(public recipy: Recipy){}
}

export class AddNewRecipyAction implements Action {
    readonly type = RecipiesActionTypes.ADD_RECIPY;
    constructor(public recipy: NewRecipy){}
}

export class AddNewRecipySuccessAction implements Action {
    readonly type = RecipiesActionTypes.ADD_RECIPY_SUCCESS;
    constructor(public recipy: Recipy){}
}

export class GetRecipiesAction implements Action {
    readonly type = RecipiesActionTypes.GET_RECIPIES;
    constructor() { }
}

export class RecipiesLoadedAction implements Action {
    readonly type = RecipiesActionTypes.RECIPIES_LOADED;
    constructor(public recipies: Recipy[]) { }
}

export type RecipiesActions = GetRecipiesAction | RecipiesLoadedAction | AddNewRecipyAction | AddNewRecipySuccessAction | UpdateRecipyAction | UpdateRecipySuccessAction;