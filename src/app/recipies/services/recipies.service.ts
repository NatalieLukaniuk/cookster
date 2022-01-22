import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MeasuringUnit } from '../models/measuring-units.enum';
import { PreparationStep } from '../models/preparationStep.interface';
import { Ingredient } from './../models/ingredient.interface';
import { Recipy } from './../models/recipy.interface';
import { AmountConverterService } from './amount-converter.service';
import { ProductsDatabaseService } from './products-database.service';
import { RecipiesApiService } from './recipies-api.service';

@Injectable({
  providedIn: 'root',
})
export class RecipiesService {
  newRecipyAdded = new Subject();
  constructor(
    private productsDb: ProductsDatabaseService,
    private api: RecipiesApiService,
    private converter: AmountConverterService
  ) {}

  processAddNewRecipy(newRecipy: Recipy) {
    if (newRecipy) {
      newRecipy.ingrediends = newRecipy.ingrediends.map((ingr: any) => {
        let productId;
        for (let product of this.productsDb.products) {
          if (product.name === ingr.ingredient) {
            productId = product.id;
            console.log(productId);
          }
        }
        ingr.product = productId;

        ingr.amount = this.transformToGr(ingr);

        return {
          product: ingr.product,
          amount: ingr.amount,
          defaultUnit: ingr.defaultUnit,
        };
      });
      newRecipy.steps = newRecipy.steps.map((step: PreparationStep) => {
        return {
          id: step.id,
          description: step.description,
          timeActive: +step.timeActive,
          timePassive: +step.timePassive,
        };
      });
      let recipy = {
        name: newRecipy.name,
        complexity: newRecipy.complexity,
        steps: newRecipy.steps,
        type: newRecipy.type,
        ingrediends: newRecipy.ingrediends,
        photo: '/assets/images/recipies/2.jpg',
      };
      this.api.addRecipy(recipy).subscribe(() => this.newRecipyAdded.next());
    }
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

  getDensity(product: number) {
    let density = 0;
    for (let item of this.productsDb.products) {
      if (item.id === product) {
        density = item.density;
      }
    }
    return density;
  }

  getGrPerItem(product: number) {
    let grInOneItem = 0;
    for (let item of this.productsDb.products) {
      if (item.id === product) {
        grInOneItem = item.grInOneItem ? item.grInOneItem : 0;
      }
    }
    return grInOneItem;
  }

  getAllRecipies() {
    return this.api.getRecipies();
  }
}
