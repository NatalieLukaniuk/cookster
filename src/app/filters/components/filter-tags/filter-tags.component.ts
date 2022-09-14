import { Filters } from './../../models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getFilters } from 'src/app/store/selectors/filters.selectors';
import { areObjectsEqual } from 'src/app/shared/utils/comparison';
import { isEqual } from 'lodash';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { Product } from 'src/app/recipies/models/products.interface';
import { DishType } from 'src/app/recipies/models/dishType.enum';
import * as FiltersActions from '../../../store/actions/filters.actions';

@Component({
  selector: 'app-filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss'],
})
export class FilterTagsComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  currentFilters: Filters | undefined;
  products: Product[] = [];

  constructor(
    private store: Store<IAppState>,
    public recipiesService: RecipiesService
  ) {
    this.store
      .pipe(select(getFilters), takeUntil(this.destroy$))
      .subscribe((filters) => {
        if (
          !this.currentFilters ||
          !areObjectsEqual(this.currentFilters, filters)
        ) {
          this.currentFilters = filters;
        }
      });
    this.recipiesService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {}

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  removeTag(tag: DishType) {
    this.store.dispatch(new FiltersActions.ToggleTagAction(tag));
  }

  removeIngrToInclude(tag: string) {
    this.store.dispatch(
      new FiltersActions.ToggleIngredientToIncludeAction(tag)
    );
  }
  removeIngrToExclude(tag: string) {
    this.store.dispatch(
      new FiltersActions.ToggleIngredientToExcludeAction(tag)
    );
  }

  getIngredientText(ingr: string): string {
    return this.recipiesService.getProductNameById(ingr);
  }

  removeMaxPrepTime() {
    this.store.dispatch(new FiltersActions.SetMaxPrepTimeAction(0));
  }

  formatPrepTimeSliderLabel() {
    if (this.currentFilters) {
      if (this.currentFilters.maxPrepTime >= 60) {
        return (this.currentFilters.maxPrepTime / 60).toFixed(1) + 'год';
      } else return this.currentFilters.maxPrepTime + 'хв';
    } else return 0;
  }
}
