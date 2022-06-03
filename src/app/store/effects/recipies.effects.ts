import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { RecipiesApiService } from "src/app/recipies/services/recipies-api.service";
import { RecipiesService } from "src/app/recipies/services/recipies.service";
import { RecipiesActionTypes } from "../actions/recipies.actions";
import * as RecipiesActions from "../actions/recipies.actions";
import { Recipy } from "src/app/recipies/models/recipy.interface";
import { of } from "rxjs";
import * as UiActions from '../actions/ui.actions'
import { Router } from "@angular/router";

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

    constructor(
        private actions$: Actions,
        private recipiesService: RecipiesApiService,
        private router: Router
    ) { }

}