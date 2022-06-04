import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { DishType } from 'src/app/recipies/models/dishType.enum';
import { Product } from 'src/app/recipies/models/products.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import * as FiltersActions from '../../../store/actions/filters.actions';

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

  constructor(private recipiesService: RecipiesService, private store: Store) { }

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

  onIngredientsToIncludeChange(event: any) {
    this.store.dispatch(new FiltersActions.ToggleIngredientToIncludeAction(event.option.value))
  }
  onIngredientsToExcludeChange(event: any) {
    this.store.dispatch(new FiltersActions.ToggleIngredientToExcludeAction(event.option.value))
  }

  onTagsChange(event: any){
    this.store.dispatch(new FiltersActions.ToggleTagAction(event.option.value))
  }

}
