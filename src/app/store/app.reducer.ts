import { appActions, appActionTypes, recipiesLoaded } from './actions/app.actions';

export interface State {
    loading: boolean;
    recipiesLoaded: boolean;
    productsLoaded: boolean;
    usersLoaded: boolean;
    currentUser: string | null;
}

export const initialState: State = {
    loading: false,
    recipiesLoaded: false,
    productsLoaded: false,
    usersLoaded: false,
    currentUser: null
};

export function reducer(state: State = initialState, action: appActions): State{
    switch (action.type){
        case appActionTypes.recipiesLoaded: {
            return {
                ...state,
                recipiesLoaded: true
            };
        }
        default:
             return state;
    }
}