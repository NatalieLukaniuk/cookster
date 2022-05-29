import { Action } from "@ngrx/store";
import { User } from "src/app/auth/models/user.interface";


export enum UserActionTypes {
    USER_LOADED = '[USER] User Loaded',
    GET_USER = '[USER] Get User'
}

export class GetUserAction implements Action {
    readonly type = UserActionTypes.GET_USER;
    constructor(){}
}

export class UserLoadedAction implements Action {
    readonly type = UserActionTypes.USER_LOADED;
    constructor (public user: User){}
}

export type UserActions = GetUserAction | UserLoadedAction;