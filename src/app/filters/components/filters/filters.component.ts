import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Product } from 'src/app/recipies/models/products.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {

  products: Product[] = [];

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

  onIngredientsToIncludeChange(event: any) {
    console.log(event.option.value)
  }
  onIngredientsToExcludeChange(event: any) {
    console.log(event.option.value)
  }

}
