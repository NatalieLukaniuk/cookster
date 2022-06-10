import { Action } from "@ngrx/store";
import { User } from "src/app/auth/models/user.interface";


export enum UserActionTypes {
    USER_LOADED = '[USER] User Loaded',
    GET_USER = '[USER] Get User',
    UPDATE_USER = '[USER] Update User',
    UPDATE_USER_SUCCESSFUL = '[USER] User Has Been Updated',
}

export class UpdateUserAction implements Action{
    readonly type = UserActionTypes.UPDATE_USER;
    constructor(public user: Partial<User>){}
}

export class UpdateUserSuccessfulAction implements Action {
    readonly type = UserActionTypes.UPDATE_USER_SUCCESSFUL;
    constructor(public response: any){}
}

export class GetUserAction implements Action {
    readonly type = UserActionTypes.GET_USER;
    constructor(){}
}

export class UserLoadedAction implements Action {
    readonly type = UserActionTypes.USER_LOADED;
    constructor (public user: User){}
}

export type UserActions = GetUserAction | UserLoadedAction | UpdateUserAction | UpdateUserSuccessfulAction;