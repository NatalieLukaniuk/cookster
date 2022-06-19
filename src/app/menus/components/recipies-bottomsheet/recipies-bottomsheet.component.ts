import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { IAppState } from 'src/app/store/reducers';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';

@Component({
  selector: 'app-recipies-bottomsheet',
  templateUrl: './recipies-bottomsheet.component.html',
  styleUrls: ['./recipies-bottomsheet.component.scss']
})
export class RecipiesBottomsheetComponent implements OnInit, OnDestroy {

  destroy$ = new Subject();

  allRecipies: Recipy[] | undefined;

  isShowFilers: boolean = false;

  constructor(private store: Store<IAppState>, private recipies: RecipiesService, private _bottomSheetRef: MatBottomSheetRef<RecipiesBottomsheetComponent>) { 
    let recipies$ = this.store.pipe(select(getAllRecipies), takeUntil(this.destroy$))
    let filters$ = this.store.pipe(select(getFilters), takeUntil(this.destroy$))
    combineLatest([recipies$, filters$]).subscribe(res => {
      let [recipies, filters] = res;
      let _recipies = recipies.map(recipy => recipy)
      if (!!filters.ingredientsToInclude.length) {
        _recipies = _recipies.filter(recipy => {
          let recipyIngredientsIds = recipy.ingrediends.map(ingr => ingr.product)
          return filters.ingredientsToInclude.every(id => recipyIngredientsIds.includes(id))
        })
      }
      if (!!filters.ingredientsToExclude.length) {
        _recipies = _recipies.filter(recipy => {
          let recipyIngredientsIds = recipy.ingrediends.map(ingr => ingr.product)
          return !recipy.ingrediends.find(ingr => filters.ingredientsToExclude.includes(ingr.product))
        })
      }
      if (!!filters.tags.length) {
        _recipies = _recipies.filter(recipy => {
          return recipy.type.find(tag => filters.tags.includes(tag))
        })
      }
      if (!!filters.maxPrepTime) {
        const maxTime = filters.maxPrepTime
        _recipies = _recipies.filter(recipy => {
          let prepTime = 0;
          recipy.steps.forEach(step => {
            prepTime = prepTime + (step.timeActive + step.timePassive)
          })
          return prepTime <= maxTime
        })
      }
      this.allRecipies = _recipies;
      this.recipies.filteredRecipies = this.allRecipies.length
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit(): void {
  }

  addRecipyToCalendar(recipyId: string){
    this._bottomSheetRef.dismiss(recipyId);
  }

}
