import { Action } from '@ngrx/store';


  export enum appActionTypes {
    recipiesLoaded = '[APP] Recipies Loaded From Database',
    
}

export class recipiesLoaded implements Action {
    public readonly type = appActionTypes.recipiesLoaded;
    constructor() { }
}

export type appActions = recipiesLoaded;