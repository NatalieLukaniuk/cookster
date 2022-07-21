import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesApiService } from 'src/app/recipies/services/recipies-api.service';

import { RecipiesActionTypes } from '../actions/recipies.actions';
import * as RecipiesActions from '../actions/recipies.actions';
import * as UiActions from '../actions/ui.actions';

@Injectable()

export class RecipiesEffects {
    getRecipies$ = createEffect(() => this.actions$.pipe(
        ofType(RecipiesActionTypes.GET_RECIPIES),
        switchMap((action: RecipiesActions.GetRecipiesAction) => this.recipiesService.getRecipies().pipe(
            map((res: Object) => {
                let array = Object.entries(res);
                let recipies: any = [];
                for (let entry of array) {
                    let recipy: any = {
                        id: entry[0],
                        ...entry[1],
                    };
                    recipies.push(recipy);
                } return recipies
            }
            ),
            map((res: Recipy[]) => new RecipiesActions.RecipiesLoadedAction(res))
        ))
    ))

    addNewRecipy$ = createEffect(() => this.actions$.pipe(
        ofType(RecipiesActionTypes.ADD_RECIPY),
        switchMap((action: RecipiesActions.AddNewRecipyAction) => this.recipiesService.addRecipy(action.recipy).pipe(
            switchMap((res: { name: string }) => {
                let recipy: Recipy = {
                    ...action.recipy,
                    id: res.name
                }
                this.router.navigate(['cookster'])
                return [
                    new RecipiesActions.AddNewRecipySuccessAction(recipy),
                    new UiActions.ShowSuccessMessageAction(`${recipy.name} has been added to the recipies database`),
                    new UiActions.SetIsLoadingFalseAction()
                ]
            }),
            catchError(error => of(new UiActions.ErrorAction(error)))
        ))
    ))

    updateRecipy$ = createEffect(() => this.actions$.pipe(
        ofType(RecipiesActionTypes.UPDATE_RECIPY),
        switchMap((action: RecipiesActions.UpdateRecipyAction) => this.recipiesService.updateRecipy(action.recipy.id, action.recipy).pipe(
            map((res: any) => new RecipiesActions.UpdateRecipySuccessAction(res)),
            catchError(error => of(new UiActions.ErrorAction(error)))
        ))
    ))

    loadNewIngredients$ = createEffect(() => this.actions$.pipe(
        ofType(RecipiesActionTypes.GET_NEW_INGREDIENTS_ACTION),
        switchMap((action: RecipiesActions.LoadNewIngredientsAction) => this.recipiesService.getIngredientsToAdd().pipe(
            map((res:any) => Object.values(res) as string[]),
            map((res: string[]) => new RecipiesActions.NewIngredientsLoadedAction(res)),
            catchError(error => of(new UiActions.ErrorAction(error)))
        ))
    ))

    saveUnknownIngredient$ = createEffect(() => this.actions$.pipe(
        ofType(RecipiesActionTypes.ADD_NEW_INGREDIENT),
        switchMap((action: RecipiesActions.AddNewIngredientAction) => this.recipiesService.saveToIngredientsToAddArray(action.ingredientName).pipe(
            map(res => new RecipiesActions.NewIngredientSavedAction()),
            catchError(error => of(new UiActions.ErrorAction(error)))
        ))
    ))

    constructor(
        private actions$: Actions,
        private recipiesService: RecipiesApiService,
        private router: Router
    ) { }

}