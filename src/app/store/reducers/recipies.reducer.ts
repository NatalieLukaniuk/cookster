import { User } from "src/app/auth/models/user.interface";
import { Recipy } from "src/app/recipies/models/recipy.interface";
import { RecipiesActions, RecipiesActionTypes } from "../actions/recipies.actions";


export interface IRecipiesState {
    allRecipies: Recipy[];
}

export const InitialRecipiesState: IRecipiesState = {
    allRecipies: []
}

export function RecipiesReducers (state: IRecipiesState = InitialRecipiesState, action: RecipiesActions): IRecipiesState {
    switch(action.type){
        case RecipiesActionTypes.RECIPIES_LOADED: {
            return {
                ...state,
                allRecipies: action.recipies
            }
        }
        default: return {...state}
    }
}