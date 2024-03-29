import { select, Store } from '@ngrx/store';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { UserService } from 'src/app/auth/services/user.service';
import * as UserActions from '../actions/user.actions';
import { UserActionTypes } from '../actions/user.actions';
import * as UiActions from '../actions/ui.actions';
import { AuthApiService } from 'src/app/auth/services/auth-api.service';
import { User } from 'src/app/auth/models/user.interface';
import { IAppState } from '../reducers';
import * as _ from 'lodash';

@Injectable()
export class UserEffects {
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.UPDATE_USER),
      switchMap((action: UserActions.UpdateUserAction) =>
        this.authService.updateUser(action.user.id!, action.user).pipe(
          map((res: User) => new UserActions.UpdateUserSuccessfulAction(res)),
          catchError((error) => of(new UiActions.ErrorAction(error)))
        )
      )
    )
  );

  createCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActionTypes.CREATE_RECIPY_COLLECTION),
      switchMap((action: UserActions.CreateRecipyCollection) =>
        this.store.pipe(
          select(getCurrentUser),
          take(1),
          map((user: User | null) => {
            if (user) {
              let updatedUser = _.cloneDeep(user);
              if(updatedUser.collections){
                updatedUser.collections.push({ name: action.collectionName, recipies: [] })
              } else updatedUser.collections = [{ name: action.collectionName, recipies: [] }]              
              return new UserActions.UpdateUserAction(updatedUser);
            } else return new UiActions.ErrorAction('no user');
          }),
          catchError((error) => of(new UiActions.ErrorAction(error)))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private authService: AuthApiService,
    private store: Store<IAppState>
  ) {}
}
