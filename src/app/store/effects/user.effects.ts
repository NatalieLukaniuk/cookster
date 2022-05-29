import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs/operators";
import { UserService } from "src/app/auth/services/user.service";
import * as UserActions from '../actions/user.actions';

@Injectable()

export class UserEffects {
    // getUser$ = createEffect(() => this.actions$.pipe(
    //     ofType(UserActions.UserActionTypes.GET_USER),
    //     switchMap((action: UserActions.UserActionTypes.GET_USER) => this.userService.)
    // ))

    constructor(
        private actions$: Actions,
        private userService: UserService
      ) {}
    
}