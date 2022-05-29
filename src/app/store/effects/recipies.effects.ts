import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs/operators";
import { RecipiesApiService } from "src/app/recipies/services/recipies-api.service";
import { RecipiesService } from "src/app/recipies/services/recipies.service";
import { RecipiesActionTypes } from "../actions/recipies.actions";
import * as RecipiesActions from "../actions/recipies.actions";
import { Recipy } from "src/app/recipies/models/recipy.interface";

@Injectable()

export class RecipiesEffects {
    getRecipies$ = createEffect(() => this.actions$.pipe(
        ofType(RecipiesActionTypes.GET_RECIPIES),
        switchMap((action: RecipiesActions.GetRecipiesAction) => this.recipiesService.getRecipies().pipe(
            map((res: Object) => {
                debugger
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

    constructor(
        private actions$: Actions,
        private recipiesService: RecipiesApiService
    ) { }

}