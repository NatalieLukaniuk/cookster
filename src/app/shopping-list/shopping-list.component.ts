import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/recipies/models/products.interface';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import { RecipiesService } from '../recipies/services/recipies.service';
import { IAppState } from '../store/reducers';
import { ShoppingListMode } from './models';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  ShoppingListMode = ShoppingListMode;

  shoppingLists: ShoppingListItem[] = []

  allProducts: Product[] = []

  constructor(private store: Store<IAppState>, private recipiesService: RecipiesService) { 
    this.store.pipe(select(getCurrentUser), map(user => user?.shoppingLists)).subscribe((lists: ShoppingListItem[] | undefined) => {
      if(lists){
        this.shoppingLists = lists
      }
    })
    this.recipiesService.products$.subscribe(res => {
      if(res){
        this.allProducts = res
      }
    })
  }

  ngOnInit() {
  }

}
