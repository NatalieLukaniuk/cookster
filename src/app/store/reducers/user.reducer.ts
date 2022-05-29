import { User } from "src/app/auth/models/user.interface";
import { UserActions, UserActionTypes } from "../actions/user.actions";

export interface IUserState {
    currentUser: User | null;
}

export const InitialUserState: IUserState = {
    currentUser: null
}

export function UserReducers (state: IUserState = InitialUserState, action: UserActions): IUserState {
    switch(action.type){
        case UserActionTypes.USER_LOADED: {
            return {
                ...state,
                currentUser: action.user
            }
        }
        default: return {...state}
    }
}