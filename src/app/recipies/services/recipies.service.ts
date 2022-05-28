import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { MeasuringUnit } from '../models/measuring-units.enum';
import { Product } from '../models/products.interface';
import { UserService } from './../../auth/services/user.service';
import { Ingredient } from './../models/ingredient.interface';
import { NewRecipy, Recipy } from './../models/recipy.interface';
import { AmountConverterService } from './amount-converter.service';
import { ProductsApiService } from './products-api.service';
import { RecipiesApiService } from './recipies-api.service';

@Injectable({
  providedIn: 'root',
})
export class RecipiesService {
  allRecipies$ = new BehaviorSubject<Recipy[]>([]);
  products$ = new BehaviorSubject<Product[]>([]);
  productsUpdated$ = new Subject<any>();
  userRecipiesUpdated$ = new Subject();
  recipiesUpdated$ = new Subject();

  constructor(
    private recipiesApi: RecipiesApiService,
    private converter: AmountConverterService,
    private productsApi: ProductsApiService,
    private userService: UserService
  ) {}

  addRecipy(recipy: NewRecipy){
    this.recipiesApi.addRecipy(recipy).subscribe((id: any) => {
      this.addRecipyToUserRecipies(id.name);
      this.recipiesUpdated$.next();
    });
  }

  updateRecipy(recipy: Recipy){
    this.recipiesApi.updateRecipy(recipy.id, recipy).pipe(take(1))
    .subscribe(() => {
      this.recipiesUpdated$.next();
    });
  }

  getIngredientIdFromName(ingr: any): string{
    let productId = '';
    for (let product of this.products$.value) {
      if (product.name === ingr.ingredient) {
        productId = product.id;
      }
    }
    return productId;
  }

  transformToGr(ingr: Ingredient) {
    let unit: MeasuringUnit = ingr.defaultUnit;
    let amount: number = ingr.amount;
    let density: number = this.getDensity(ingr.product);
    let grInOneItem: number = this.getGrPerItem(ingr.product);
    switch (unit) {
      case MeasuringUnit.gr:
        return amount;
        break;
      case MeasuringUnit.kg:
        return this.converter.kgToGR(amount);
        break;
      case MeasuringUnit.bunch:
        return this.converter.bunchToGr(amount);
        break;
      case MeasuringUnit.coffeeSpoon:
        return this.converter.coffeeSpoonsToGr(amount, density);
        break;
      case MeasuringUnit.dessertSpoon:
        return this.converter.dessertSpoonsToGr(amount, density);
        break;
      case MeasuringUnit.l:
        return this.converter.literToGr(amount, density);
        break;
      case MeasuringUnit.ml:
        return this.converter.mlToGr(amount, density);
        break;
      case MeasuringUnit.pinch:
        return this.converter.pinchToGr(amount);
        break;
      case MeasuringUnit.tableSpoon:
        return this.converter.tableSpoonsToGr(amount, density);
        break;
      case MeasuringUnit.teaSpoon:
        return this.converter.teaSpoonsToGr(amount, density);
      case MeasuringUnit.item:
        return this.converter.itemsToGr(amount, grInOneItem);
    }
  }

  getDensity(productId: string) {
    let density = 0;
    for (let item of this.products$.value) {
      if (item.id === productId) {
        density = item.density;
      }
    }
    return density;
  }

  getGrPerItem(productId: string) {
    let grInOneItem = 0;
    for (let item of this.products$.value) {
      if (item.id === productId) {
        grInOneItem = item.grInOneItem ? item.grInOneItem : 0;
      }
    }
    return grInOneItem;
  }

  getRecipies() {
    this.recipiesApi
      .getRecipies()
      .pipe(take(1))
      .subscribe((res) => {
        let array = Object.entries(res);
        let recipies: any = [];
        for (let entry of array) {
          let recipy: any = {
            id: entry[0],
            ...entry[1],
          };
          recipies.push(recipy);
        }
        this.allRecipies$.next(recipies);
      });
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
    let productName = '';
    for (let product of this.products$.value) {
      if (product.id === ingr.product) {
        productName = product.name;
      }
    }
    return productName;
  }

  convertAmountToSelectedUnit(unit: MeasuringUnit, ingredient: Ingredient) {
    if (unit == MeasuringUnit.gr) {
      return ingredient.amount;
    } else {
      let amount = 0;
      switch (unit) {
        case MeasuringUnit.kg:
          amount = this.converter.grToKg(ingredient.amount);
          break;
        case MeasuringUnit.l:
          amount = this.converter.grToLiter(
            ingredient.amount,
            this.getDensity(ingredient.product)
          );
          break;
        case MeasuringUnit.ml:
          amount = this.converter.grToMl(
            ingredient.amount,
            this.getDensity(ingredient.product)
          );
          break;
        case MeasuringUnit.tableSpoon:
          amount = this.converter.grToTableSpoons(
            ingredient.amount,
            this.getDensity(ingredient.product)
          );
          break;
        case MeasuringUnit.dessertSpoon:
          amount = this.converter.grToDessertSpoons(
            ingredient.amount,
            this.getDensity(ingredient.product)
          );
          break;
        case MeasuringUnit.teaSpoon:
          amount = this.converter.grToTeaSpoons(
            ingredient.amount,
            this.getDensity(ingredient.product)
          );
          break;
        case MeasuringUnit.coffeeSpoon:
          amount = this.converter.grToCoffeeSpoons(
            ingredient.amount,
            this.getDensity(ingredient.product)
          );
          break;
        case MeasuringUnit.pinch:
          amount = this.converter.grToPinch(ingredient.amount);
          break;
        case MeasuringUnit.bunch:
          amount = this.converter.grToBunch(ingredient.amount);
          break;
        case MeasuringUnit.item:
          amount = this.converter.grToItems(
            ingredient.amount,
            this.getGrPerItem(ingredient.product)
          );
      }
      return amount;
    }
  }

  addRecipyToUserRecipies(recipyId: string) {
    let recipies = [];
    if (this.userService.currentUser.recipies) {
      recipies = this.userService.currentUser.recipies;
    }
    recipies.push(recipyId);
    let updatedUserRecipies = { recipies: recipies };
    this.userService
      .updateUserDetailsFromMyDatabase(updatedUserRecipies)
      .pipe(take(1))
      .subscribe((res) => this.getRecipies());
  }

  removeRecipyFromUserRecipies(recipyId: string) {
    let recipies = this.userService.currentUser.recipies;
    let index = recipies.indexOf(recipyId);
    recipies.splice(index, 1);
    let updatedUserRecipies = { recipies: recipies };
    this.userService
      .updateUserDetailsFromMyDatabase(updatedUserRecipies)
      .pipe(take(1))
      .subscribe((res) => this.getRecipies());
  }

  deleteRecipy(recipy: Recipy) {
    this.recipiesApi
      .deleteRecipy(recipy.id)
      .pipe(take(1))
      .subscribe((res) => this.recipiesUpdated$.next());
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

  getIsUserRecipy(recipy: Recipy){
    if(this.userService.currentUser.recipies){
      return this.userService.currentUser.recipies.includes(recipy.id)
    } else return false
  }
}
