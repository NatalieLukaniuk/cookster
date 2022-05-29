import { Action } from "@ngrx/store";
import { Recipy } from "src/app/recipies/models/recipy.interface";

export enum RecipiesActionTypes {
    RECIPIES_LOADED = '[RECIPIES] Recipies Loaded',
    GET_RECIPIES = '[RECIPIES] Get Recipies'
}

export class GetRecipiesAction implements Action {
    readonly type = RecipiesActionTypes.GET_RECIPIES;
    constructor() { }
}

export class RecipiesLoadedAction implements Action {
    readonly type = RecipiesActionTypes.RECIPIES_LOADED;
    constructor(public recipies: Recipy[]) { }
}

export type RecipiesActions = GetRecipiesAction | RecipiesLoadedAction;