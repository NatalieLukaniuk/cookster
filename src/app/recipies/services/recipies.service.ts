import { ProductType } from './../models/products.interface';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { IAppState } from 'src/app/store/reducers';

import * as fromRecipiesActions from '../../store/actions/recipies.actions';
import { MeasuringUnit } from '../models/measuring-units.enum';
import { Product } from '../models/products.interface';
import { UserService } from './../../auth/services/user.service';
import { Ingredient } from './../models/ingredient.interface';
import { NewRecipy, Recipy } from './../models/recipy.interface';
import { ProductsApiService } from './products-api.service';
import { RecipiesApiService } from './recipies-api.service';
import {
  getAmountInSelectedUnit,
  getCalorificValue,
  getDefaultMeasuringUnit,
  getIngredientIdFromName,
  getIngredientText,
  getProductText,
  isIngrIncludedInAmountCalculation,
  transformToGr,
} from './recipies.utils';

@Injectable({
  providedIn: 'root',
})
export class RecipiesService {
  products$ = new BehaviorSubject<Product[]>([]);
  productsUpdated$ = new Subject<any>();
  productsLoaded$ = new BehaviorSubject<boolean>(false);

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
        this.productsLoaded$.next(true)
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

  getProductNameById(id: string): string {
    return getProductText(id, this.products$.value);
  }

  getDefaultMU(id: string): MeasuringUnit{
    return getDefaultMeasuringUnit(id, this.products$.value)
  }

  getAmountInSelectedUnit(
    selectedUnit: MeasuringUnit,
    ingredientId: string,
    amountInGr: number
  ){
    return getAmountInSelectedUnit(selectedUnit, ingredientId, amountInGr, this.products$.value)
  }

  getProductType(ingredientId: string){
    let product = this.products$.value.find(product => product.id == ingredientId);
    if(product){
      return product.type
    } else return ProductType.spice
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
      if ('photo' in recipy) {
        updatedRecipy.photo = recipy.photo;
      }
      updatedRecipy.notApproved = this.checkIsRecipyApproved(updatedRecipy);
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
      if ('photo' in recipy) {
        clonedRecipy.photo = recipy.photo;
      }
      clonedRecipy.notApproved = this.checkIsRecipyApproved(clonedRecipy);
      this.store.dispatch(
        new fromRecipiesActions.AddNewRecipyAction(clonedRecipy)
      );
    }
  }

  checkIsRecipyApproved(recipy: Recipy | NewRecipy): boolean {
    return !recipy.ingrediends.find((ingr) =>
      this.getIsIngredientInDB(ingr.product)
    );
  }

  transformToGr(ingr: Ingredient, amount: number) {
    return transformToGr(ingr, amount, ingr.defaultUnit, this.products$.value);
  }

  getIsIngredientInDB(id: string) {
    return this.products$.value.find((ingr) => ingr.id == id);
  }

  getIsIngredientIncludedInAmountCalculation(ingr: Ingredient): boolean {
    return isIngrIncludedInAmountCalculation(ingr, this.products$.value);
  }

  getCoeficient(
    ingredients: Ingredient[],
    portionsToServe: number,
    portionSize: number
  ) {
    let amount = 0;
    for (let ingr of ingredients) {
      if (
        this.getIsIngredientInDB(ingr.product) &&
        this.getIsIngredientIncludedInAmountCalculation(ingr)
      ) {
        amount = ingr.amount + amount; // amount of ingreds with calories
      }
    }
    return (portionsToServe * portionSize) / amount;
  }

  countRecipyCalorificValue(ingreds: Ingredient[]){
    let calories = 0;
    let totalAmount = 0;
    ingreds.forEach(ingr => {
      totalAmount += ingr.amount;
      calories += ingr.amount * getCalorificValue(ingr, this.products$.value)
    })
    return calories / totalAmount
  }
}
