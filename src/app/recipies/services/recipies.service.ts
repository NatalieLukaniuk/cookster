import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { IAppState } from 'src/app/store/reducers';

import * as fromRecipiesActions from '../../store/actions/recipies.actions';
import { Product } from '../models/products.interface';
import { UserService } from './../../auth/services/user.service';
import { Ingredient } from './../models/ingredient.interface';
import { NewRecipy, Recipy } from './../models/recipy.interface';
import { ProductsApiService } from './products-api.service';
import { RecipiesApiService } from './recipies-api.service';
import { getIngredientIdFromName, getIngredientText, transformToGr } from './recipies.utils';

@Injectable({
  providedIn: 'root',
})
export class RecipiesService {
  products$ = new BehaviorSubject<Product[]>([]);
  productsUpdated$ = new Subject<any>();

  filteredRecipies: number = 0;

  constructor(
    private recipiesApi: RecipiesApiService,
    private productsApi: ProductsApiService,
    private userService: UserService,
    private store: Store<IAppState>
  ) {}

  getIngredientIdFromName(ingr: any): string {
    return getIngredientIdFromName(ingr, this.products$.value);
  }

  getRecipyById(id: string) {
    return this.recipiesApi.getRecipyById(id);
  }

  processAddNewProduct(product: Product) {
    this.productsApi.addProduct(product).subscribe((res) => {
      this.productsUpdated$.next();
    });
  }

  getAllProducts() {
    return this.productsApi
      .getProducts()
      .pipe(take(1))
      .subscribe((res) => {
        let array = Object.entries(res);
        let products: any = [];
        for (let entry of array) {
          let recipy: any = {
            id: entry[0],
            ...entry[1],
          };
          products.push(recipy);
        }
        this.products$.next(products);
      });
  }

  deleteProduct(product: Product) {
    this.productsApi
      .deleteProduct(product)
      .pipe(take(1))
      .subscribe((res) => this.productsUpdated$.next());
  }

  getIngredientText(ingr: Ingredient): string {
    return getIngredientText(ingr, this.products$.value);
  }

  deleteRecipy(recipy: Recipy) {
    this.recipiesApi
      .deleteRecipy(recipy.id)
      .pipe(take(1))
      .subscribe((res) => {});
  }

  getRecipyBelongsTo(recipy: Recipy) {
    if (recipy.clonedBy) {
      return recipy.clonedBy;
    } else {
      return recipy.author;
    }
  }

  getRecipyCreatedOn(recipy: Recipy) {
    if (recipy.clonedOn) {
      return recipy.clonedOn;
    } else return recipy.createdOn;
  }

  saveUpdatedRecipy(recipy: Recipy, currentUserEmail: string) {
    if (
      currentUserEmail == recipy.author ||
      ('clonedBy' in recipy && recipy.clonedBy == currentUserEmail)
    ) {
      let updatedRecipy: Recipy = {
        id: recipy.id,
        name: recipy.name,
        ingrediends: recipy.ingrediends,
        complexity: recipy.complexity,
        steps: recipy.steps,
        type: recipy.type,
        isSplitIntoGroups: recipy.isSplitIntoGroups,
        author: recipy.author,
        createdOn: recipy.createdOn,
        editedBy: currentUserEmail,
        lastEdited: Date.now(),
        isBaseRecipy: recipy.isBaseRecipy,
      };
      if ('clonedBy' in recipy) {
        (updatedRecipy.clonedBy = recipy.clonedBy),
          (updatedRecipy.clonedOn = recipy.clonedOn);
      }
      this.store.dispatch(
        new fromRecipiesActions.UpdateRecipyAction(updatedRecipy)
      );
    } else {
      let clonedRecipy: NewRecipy = {
        name: recipy.name,
        ingrediends: recipy.ingrediends,
        complexity: recipy.complexity,
        steps: recipy.steps,
        type: recipy.type,
        isSplitIntoGroups: recipy.isSplitIntoGroups,
        author: recipy.author,
        createdOn: recipy.createdOn,
        clonedBy: currentUserEmail,
        clonedOn: Date.now(),
        isBaseRecipy: recipy.isBaseRecipy,
      };
      this.store.dispatch(
        new fromRecipiesActions.AddNewRecipyAction(clonedRecipy)
      );
    }
  }

  transformToGr(ingr: Ingredient, amount: number) {
    return transformToGr(ingr, amount, ingr.defaultUnit, this.products$.value);
  }

  getIsIngredientInDB(id: string){
    return this.products$.value.find(ingr => ingr.id == id)
  }
}
