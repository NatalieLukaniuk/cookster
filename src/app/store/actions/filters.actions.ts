import { Action } from "@ngrx/store";

export enum FiltersActionTypes {
    TOGGLE_INGREDIENT_TO_INCLUDE = '[FILTERS] Toggle Ingredient To Include',
    TOGGLE_INGREDIENT_TO_EXLUDE = '[FILTERS] Toggle Ingredient To Exclude',
    TOGGLE_TAG = '[FILTERS] Toggle Tag'
}

export class ToggleIngredientToIncludeAction implements Action {
    readonly type = FiltersActionTypes.TOGGLE_INGREDIENT_TO_INCLUDE;
    constructor(public ingredientId: string){}
}

export class ToggleIngredientToExcludeAction implements Action {
    readonly type = FiltersActionTypes.TOGGLE_INGREDIENT_TO_EXLUDE;
    constructor(public ingredientId: string){}
}

export class ToggleTagAction implements Action {
    readonly type = FiltersActionTypes.TOGGLE_TAG;
    constructor(public tagNumber: number){}
}

export type FiltersActions = ToggleIngredientToIncludeAction | ToggleIngredientToExcludeAction | ToggleTagAction;