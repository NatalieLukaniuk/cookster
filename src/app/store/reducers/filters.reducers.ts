import { FiltersActions, FiltersActionTypes } from "../actions/filters.actions";

export interface FiltersState {
    ingredientsToInclude: string[],
    ingredientsToExclude: string[]
}

export const InitialFiltersState: FiltersState = {
    ingredientsToInclude: [],
    ingredientsToExclude: []
}

export function FiltersReducers(state: FiltersState = InitialFiltersState, action: FiltersActions): FiltersState {
    switch (action.type) {
        case FiltersActionTypes.TOGGLE_INGREDIENT_TO_INCLUDE: {
            return {
                ...state,
                ingredientsToInclude: processToggleIngredient(state.ingredientsToInclude, action.ingredientId)
            }
        }

        case FiltersActionTypes.TOGGLE_INGREDIENT_TO_EXLUDE: {
            return {
                ...state,
                ingredientsToExclude: processToggleIngredient(state.ingredientsToExclude, action.ingredientId)
            }
        }
        default: return {...state}
    }
}


export function processToggleIngredient(ingredientsArray: string[], ingredientId: string): string[] {
    let _array = ingredientsArray.map(ingr => ingr);
    if (_array.includes(ingredientId)) {
        _array = _array.filter(ingr => ingr !== ingredientId)
    } else {
        _array.push(ingredientId)
    }
    return _array
}