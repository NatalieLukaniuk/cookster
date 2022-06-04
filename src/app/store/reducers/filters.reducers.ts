import { FiltersActions, FiltersActionTypes } from "../actions/filters.actions";

export interface FiltersState {
    ingredientsToInclude: string[],
    ingredientsToExclude: string[],
    tags: number[]
}

export const InitialFiltersState: FiltersState = {
    ingredientsToInclude: [],
    ingredientsToExclude: [],
    tags: []
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

        case FiltersActionTypes.TOGGLE_TAG: {
            return {
                ...state,
                tags: processToggleTag(state.tags, action.tagNumber)
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

export function processToggleTag(tagsArray: number[], tagId: number): number[] {
    let _array = tagsArray.map(tag => tag);
    if (_array.includes(tagId)) {
        _array = _array.filter(tag => tag !== tagId)
    } else {
        _array.push(tagId)
    }
    return _array
}