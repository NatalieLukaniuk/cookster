import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { UserService } from "src/app/auth/services/user.service";
import * as UserActions from '../actions/user.actions';
import { UserActionTypes } from "../actions/user.actions";
import * as UiActions from '../actions/ui.actions'

@Injectable()

export class UserEffects {
    updateUser$ = createEffect(() => this.actions$.pipe(
      ofType(UserActionTypes.UPDATE_USER),
      switchMap((action: UserActions.UpdateUserAction) => this.userService.updateUserDetailsFromMyDatabase(action.user).pipe(
        map((res) => new UserActions.UpdateUserSuccessfulAction(res)),
        catchError(error => of(new UiActions.ErrorAction(error)))
      ))
    ))

    constructor(
        private actions$: Actions,
        private userService: UserService
      ) {}
    
}