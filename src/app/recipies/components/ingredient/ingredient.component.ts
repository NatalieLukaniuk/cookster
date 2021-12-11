import { Component, Input, OnInit } from '@angular/core';

import { Ingredient } from './../../models/ingredient.interface';
import {
  MeasuringUnit,
  MeasuringUnitOptionsFluid,
  MeasuringUnitOptionsHardItems,
  MeasuringUnitOptionsHerbs,
  MeasuringUnitOptionsSpice,
  MeasuringUnitText,
} from './../../models/measuring-units.enum';
import { AmountConverterService } from './../../services/amount-converter.service';
import { ProductsDatabaseService, ProductType } from './../../services/products-database.service';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit {
  @Input()
  ingredient!: Ingredient;
  @Input()
  savedPortionsToServe!: number;
  @Input()
  actualPortionsToServe!: number;

  measuringUnit: MeasuringUnit = MeasuringUnit.gr;
  constructor(
    private productsDb: ProductsDatabaseService,
    private converter: AmountConverterService
  ) {}

  ngOnInit() {
    this.measuringUnit = this.getDefaultMeasuringUnit();
  }

  getIngredientText(ingr: Ingredient): string {
    let productName = '';
    for (let product of this.productsDb.products) {
      if (product.id === this.ingredient.product) {
        productName = product.name;
      }
    }
    return productName;
  }

  getAmount(amount: number) {
    if (this.savedPortionsToServe == this.actualPortionsToServe) {
      return amount;
    } else {
      const amountPerPortion = amount / this.savedPortionsToServe;
      const actualAmount = amountPerPortion * this.actualPortionsToServe;
      return actualAmount;
    }
  }

  getDefaultMeasuringUnit() {
    return this.ingredient.defaultUnit;
  }

  get productType(){
    let type: ProductType = ProductType.hardItem;
    for (let product of this.productsDb.products) {
      if (product.id === this.ingredient.product) {
        type = product.type;
      }
    }
    return type;
  }
  get measurementUnits() {
    let optionsArray: MeasuringUnit[] = [];
    switch(this.productType){
      case ProductType.fluid: optionsArray = MeasuringUnitOptionsFluid;
      break;
      case ProductType.hardItem: optionsArray = MeasuringUnitOptionsHardItems;
      break;
      case ProductType.herb: optionsArray = MeasuringUnitOptionsHerbs;
      break;
      case ProductType.spice: optionsArray = MeasuringUnitOptionsSpice;
    }
    return optionsArray;
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  onValueChange(event: any) {    
    this.measuringUnit = +event.target.value;
  }

  get actualAmount() {
    if (this.measuringUnit == MeasuringUnit.gr) {
      return this.ingredient.amount;
    } else {
      let amount = 0;
      switch (this.measuringUnit) {
        case MeasuringUnit.kg:
          amount = this.converter.grToKg(this.ingredient.amount);
          break;
        case MeasuringUnit.l:
          amount = this.converter.grToLiter(
            this.ingredient.amount,
            this.density
          );
          break;
        case MeasuringUnit.ml:
          amount = this.converter.grToMl(this.ingredient.amount, this.density);
          break;
        case MeasuringUnit.tableSpoon:
          amount = this.converter.grToTableSpoons(
            this.ingredient.amount,
            this.density
          );
          break;
        case MeasuringUnit.dessertSpoon:
          amount = this.converter.grToDessertSpoons(
            this.ingredient.amount,
            this.density
          );
          break;
        case MeasuringUnit.teaSpoon:
          amount = this.converter.grToTeaSpoons(
            this.ingredient.amount,
            this.density
          );
          break;
        case MeasuringUnit.coffeeSpoon:
          amount = this.converter.grToCoffeeSpoons(
            this.ingredient.amount,
            this.density
          );
          break;
        case MeasuringUnit.pinch:
          amount = this.converter.grToPinch(this.ingredient.amount);
          break;
        case MeasuringUnit.bunch:
          amount = this.converter.grToBunch(this.ingredient.amount);
      }
      return amount;
    }
  }

  get density() {
    let density = 1;
    for (let product of this.productsDb.products) {
      if (product.id === this.ingredient.product) {
        density = product.density;
      }
    }
    return density;
  }

  get amountToDisplay() {
    const convertedToSelectedUnit = this.actualAmount;
    let amountPerSelectedPortions = this.getAmount(convertedToSelectedUnit);
    if (amountPerSelectedPortions % 1){
      amountPerSelectedPortions = +amountPerSelectedPortions.toFixed(2);
    } 
    return amountPerSelectedPortions;
  }
}
