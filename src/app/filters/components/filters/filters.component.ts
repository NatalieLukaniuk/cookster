import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSliderChange } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { DishType } from 'src/app/recipies/models/dishType.enum';
import { Product } from 'src/app/recipies/models/products.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import * as FiltersActions from '../../../store/actions/filters.actions';
import * as UiActions from '../../../store/actions/ui.actions'

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  get tags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }

  destroyed$ = new Subject();

  constructor(public recipiesService: RecipiesService, private store: Store) { }

  ngOnInit(): void {
    this.recipiesService.products$.subscribe((products: Product[]) => {
      this.products = products;
    })
  }

  ngOnDestroy(): void {
    this.destroyed$.complete()
  }

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  onIngredientsToIncludeChange(event: MatSelectionListChange) {
    this.store.dispatch(new FiltersActions.ToggleIngredientToIncludeAction(event.option.value))
  }
  onIngredientsToExcludeChange(event: MatSelectionListChange) {
    this.store.dispatch(new FiltersActions.ToggleIngredientToExcludeAction(event.option.value))
  }

  onTagsChange(event: MatSelectionListChange) {
    console.log(event)
    this.store.dispatch(new FiltersActions.ToggleTagAction(event.option.value))
  }

  formatPrepTimeSliderLabel(value: number) {
    if (value >= 60) {
      return (value / 60).toFixed(1) + 'год';
    } else return value + "хв";
  }

  onPrepTimeChange(event: MatSliderChange) {
    if (!!event.value) {
      this.store.dispatch(new FiltersActions.SetMaxPrepTimeAction(event.value))
    }
  }

  @ViewChild('ingrediendsFilter') ingrediendsFilter!: MatSelectionList;
  @ViewChild('tagsFilter') tagsFilter!: MatSelectionList;
  @ViewChild('ingrediendsFilter2') ingrediendsFilter2!: MatSelectionList;
  clearFilters(){
    this.ingrediendsFilter.deselectAll();
    this.tagsFilter.deselectAll()
    this.ingrediendsFilter2.deselectAll()
    this.store.dispatch(new FiltersActions.ResetFiltersAction())
  }

  closeSidebar(){
    this.store.dispatch(new UiActions.SetIsSidebarOpenAction(false))
  }
}
