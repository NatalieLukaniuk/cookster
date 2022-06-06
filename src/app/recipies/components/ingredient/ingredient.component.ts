import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RecipyMode } from '../../containers/edit-recipy/edit-recipy.component';

import { ProductType } from '../../models/products.interface';
import { RecipiesService } from '../../services/recipies.service';
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
import * as _ from 'lodash'

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit, OnChanges {
  @Input()
  ingredient!: Ingredient;
  @Input()
  savedPortionsToServe!: number;
  @Input()
  actualPortionsToServe!: number;
  @Input()
  isMobile!: boolean;
  @Input() mode: RecipyMode = RecipyMode.ViewRecipy;

  @Output() ingredientChanged = new EventEmitter<Ingredient>()
  @Output() deleteIngredient = new EventEmitter<Ingredient>()

  RecipyMode = RecipyMode;
  _ingredient: Ingredient | undefined;
  _amountInSelectedUnit: number = 0;
  _savedAmount: number = 0;

  measuringUnit: MeasuringUnit = MeasuringUnit.gr;
  constructor(
    private converter: AmountConverterService,
    private recipiesService: RecipiesService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this._ingredient = _.cloneDeep(this.ingredient);
      this._amountInSelectedUnit = this.recipiesService.convertAmountToSelectedUnit(this._ingredient.defaultUnit, this._ingredient);
      this._savedAmount = this.recipiesService.convertAmountToSelectedUnit(this._ingredient.defaultUnit, this._ingredient);
    }
  }

  ngOnInit() {
    this.measuringUnit = this.getDefaultMeasuringUnit();
  }

  getIngredientText(): string {
    return this.recipiesService.getIngredientText(this.ingredient)
  }

  getAmount(amount: number) {
    if (!!this.savedPortionsToServe && !!this.actualPortionsToServe) {
      if (this.savedPortionsToServe == this.actualPortionsToServe) {
        return amount;
      } else {
        const amountPerPortion = amount / this.savedPortionsToServe;
        const actualAmount = amountPerPortion * this.actualPortionsToServe;
        return actualAmount;
      }
    } else return amount

  }

  getDefaultMeasuringUnit() {
    return this.ingredient.defaultUnit;
  }

  get productType() {
    let type: ProductType = ProductType.hardItem;
    for (let product of this.recipiesService.products$.value) {
      if (product.id === this.ingredient.product) {
        type = product.type;
      }
    }
    return type;
  }
  get measurementUnits() {
    let optionsArray: MeasuringUnit[] = [];
    switch (this.productType) {
      case ProductType.fluid:
        optionsArray = MeasuringUnitOptionsFluid;
        break;
      case ProductType.hardItem:
        optionsArray = MeasuringUnitOptionsHardItems;
        break;
      case ProductType.herb:
        optionsArray = MeasuringUnitOptionsHerbs;
        break;
      case ProductType.spice:
        optionsArray = MeasuringUnitOptionsSpice;
    }
    return optionsArray;
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  onValueChange(event: any) {
    this.measuringUnit = +event.target.value; //TODO: needs refactoring
  }

  onValueChangeMatMenu(value: any) {
    this.measuringUnit = value; //TODO: needs refactoring
  }

  amountChanged() {
    if (!!this._ingredient) {
      let ingr: Ingredient = {
        product: this._ingredient?.product,
        amount: this._amountInSelectedUnit,
        defaultUnit: this._ingredient?.defaultUnit
      }
      let amountToSave = this.recipiesService.transformToGr(ingr)
      let ingrToSave: Ingredient = {
        product: this._ingredient?.product,
        amount: amountToSave,
        defaultUnit: this._ingredient?.defaultUnit
      }
      if ('group' in this._ingredient) {
        ingrToSave.group = this._ingredient.group
      }
      this._savedAmount = _.cloneDeep(this._amountInSelectedUnit)
      this.ingredientChanged.emit(ingrToSave)
    }
  }

  onDeleteIngredient(){
    this.deleteIngredient.emit(this._ingredient)
  }

  get amountToDisplay() {
    const convertedToSelectedUnit = this.recipiesService.convertAmountToSelectedUnit(this.measuringUnit, this.ingredient);
    let amountPerSelectedPortions = this.getAmount(convertedToSelectedUnit);
    if (amountPerSelectedPortions % 1) {
      amountPerSelectedPortions = +amountPerSelectedPortions.toFixed(2);
    }
    return amountPerSelectedPortions;
  }
}
