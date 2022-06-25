import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/recipies/models/products.interface';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import { User } from '../auth/models/user.interface';
import { RecipiesService } from '../recipies/services/recipies.service';
import { IAppState } from '../store/reducers';
import * as UserActions from './../store/actions/user.actions';
import { ShoppingListMode } from './models';
import { ShoppingListService } from './services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  ShoppingListMode = ShoppingListMode;

  shoppingLists: ShoppingListItem[] = [];

  allProducts: Product[] = [];

  currentUser: User | undefined;

  constructor(
    private store: Store<IAppState>,
    private recipiesService: RecipiesService,
    private shoppingListService: ShoppingListService
  ) {
    this.store
      .pipe(
        select(getCurrentUser),
        map((user) => {
          if (user) {
            this.currentUser = user;
          }
          return user?.shoppingLists;
        })
      )
      .subscribe((lists: ShoppingListItem[] | undefined) => {
        if (lists) {
          this.shoppingLists = lists;
        } else this.shoppingLists = []
      });
    this.recipiesService.products$.subscribe((res) => {
      if (res) {
        this.allProducts = res;
      }
    });
  }

  ngOnInit() {}

  cleanShoppingList() {
    // confirmation dialog needs to be added here
    if (this.currentUser) {
      this.shoppingListService.removeShoppingLists(this.currentUser);
    }
  }

  onListsUpdated(event: ShoppingListItem[]){
    if (this.currentUser){
      let updatedUser = _.cloneDeep(this.currentUser);
      updatedUser.shoppingLists = event;
      this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }
  }
}
