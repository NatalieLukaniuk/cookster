import { Action } from "@ngrx/store";

export enum FiltersActionTypes {
    TOGGLE_INGREDIENT_TO_INCLUDE = '[FILTERS] Toggle Ingredient To Include',
    TOGGLE_INGREDIENT_TO_EXLUDE = '[FILTERS] Toggle Ingredient To Exclude',
}

export class ToggleIngredientToIncludeAction implements Action {
    readonly type = FiltersActionTypes.TOGGLE_INGREDIENT_TO_INCLUDE;
    constructor(public ingredientId: string){}
}

export class ToggleIngredientToExcludeAction implements Action {
    readonly type = FiltersActionTypes.TOGGLE_INGREDIENT_TO_EXLUDE;
    constructor(public ingredientId: string){}
}

export type FiltersActions = ToggleIngredientToIncludeAction | ToggleIngredientToExcludeAction;