import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IAppState } from 'src/app/store/reducers';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';

@Component({
  selector: 'app-all-recipies',
  templateUrl: './all-recipies.component.html',
  styleUrls: ['./all-recipies.component.scss']
})
export class AllRecipiesComponent implements OnInit {

  allRecipies: Recipy[] | undefined;
  isMobile: boolean = false;
  currentUser: User | undefined;
  destroy$ = new Subject();
  constructor(
    private recipies: RecipiesService,
    private layoutService: LayoutService,
    private store: Store<IAppState>
  ) {
    this.store.pipe(select(getCurrentUser)).subscribe((res: any) => {
      if (!!res) {
        this.currentUser = res;
      }
    })
    let recipies$ = this.store.pipe(select(getAllRecipies))
    let filters$ = this.store.pipe(select(getFilters))
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
      if(!!filters.tags.length){
        _recipies = _recipies.filter(recipy => {
          return recipy.type.find(tag => filters.tags.includes(tag))
        })
      }
      if(!!filters.maxPrepTime){
        const maxTime = filters.maxPrepTime
        _recipies = _recipies.filter(recipy => {
          let prepTime = 0;
          recipy.steps.forEach(step => {
            prepTime = prepTime + (step.timeActive + step.timePassive)
          })
          return prepTime <= maxTime
        })
      }
      this.allRecipies = _recipies
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit() {
    this.layoutService.isMobile$.pipe(takeUntil(this.destroy$)).subscribe(bool => this.isMobile = bool)
  }

}
