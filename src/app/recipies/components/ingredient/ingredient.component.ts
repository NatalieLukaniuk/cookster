import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';

import { AppMode } from '../../containers/edit-recipy/edit-recipy.component';
import { ProductType } from '../../models/products.interface';
import { RecipiesService } from '../../services/recipies.service';
import { convertAmountToSelectedUnit, NormalizeDisplayedAmount, transformToGr } from '../../services/recipies.utils';
import { DialogsService } from './../../../shared/services/dialogs.service';
import { Ingredient } from './../../models/ingredient.interface';
import {
  degradeToSmallerUnit,
  isDegradable,
  MeasuringUnit,
  MeasuringUnitOptionsFluid,
  MeasuringUnitOptionsGranular,
  MeasuringUnitOptionsHardHomogeneous,
  MeasuringUnitOptionsHardItems,
  MeasuringUnitOptionsHerbs,
  MeasuringUnitOptionsSpice,
  MeasuringUnitText,
} from './../../models/measuring-units.enum';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit, OnChanges {
  @Input()
  ingredient!: Ingredient;
  @Input()
  isMobile!: boolean;
  @Input() mode: AppMode = AppMode.ViewRecipy;
  @Input() coeficientOfAmount: number = 1;

  @Output() ingredientChanged = new EventEmitter<Ingredient>();
  @Output() deleteIngredient = new EventEmitter<Ingredient>();

  AppMode = AppMode;
  _ingredient: Ingredient | undefined;
  _amountInSelectedUnit: number = 0;
  _savedAmount: number = 0;

  isProductInDB: boolean = false;

  measuringUnit: MeasuringUnit = MeasuringUnit.gr;

  NormalizeDisplayedAmount = NormalizeDisplayedAmount;
  constructor(
    private recipiesService: RecipiesService,
    private dialogsService: DialogsService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ingredient) {
      this._ingredient = _.cloneDeep(this.ingredient);
      this._amountInSelectedUnit = convertAmountToSelectedUnit(
        this._ingredient.defaultUnit,
        this._ingredient,
        this.recipiesService.products$.value
      );
      this._savedAmount = convertAmountToSelectedUnit(
        this._ingredient.defaultUnit,
        this._ingredient,
        this.recipiesService.products$.value
      );
      this.measuringUnit = this._ingredient.defaultUnit;
    }
  }

  ngOnInit() {
    this.isProductInDB = !!this.recipiesService.getIsIngredientInDB(
      this.ingredient.product
    );
    this.measuringUnit = this.getDefaultMeasuringUnit();
  }

  getIngredientText(): string {
    return this.recipiesService.getIngredientText(this.ingredient);
  }

  getAmount(amount: number) {
    return amount * this.coeficientOfAmount;
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
        break;
      case ProductType.granular:
        optionsArray = MeasuringUnitOptionsGranular;
        break;
      case ProductType.hardHomogenious:
        optionsArray = MeasuringUnitOptionsHardHomogeneous;
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
    if (!!this._ingredient) {
      let ingrToSave: Ingredient = {
        product: this._ingredient?.product,
        amount: this._ingredient.amount,
        defaultUnit: value,
      };
      if ('group' in this._ingredient) {
        ingrToSave.group = this._ingredient.group;
      }
      this.ingredientChanged.emit(ingrToSave);
    }
  }

  amountChanged() {
    if (!!this._ingredient) {
      let ingr: Ingredient = {
        product: this._ingredient?.product,
        amount: +this._amountInSelectedUnit,
        defaultUnit: this._ingredient?.defaultUnit,
      };
      let amountToSave = transformToGr(
        ingr,
        +this._amountInSelectedUnit,
        ingr.defaultUnit,
        this.recipiesService.products$.value
      );
      let ingrToSave: Ingredient = {
        product: this._ingredient?.product,
        amount: amountToSave,
        defaultUnit: this._ingredient?.defaultUnit,
      };
      if ('group' in this._ingredient) {
        ingrToSave.group = this._ingredient.group;
      }
      this._savedAmount = _.cloneDeep(this._amountInSelectedUnit);
      this.ingredientChanged.emit(ingrToSave);
    }
  }

  onDeleteIngredient() {
    this.deleteIngredient.emit(this._ingredient);
  }

  get amountToDisplay() {
    const convertedToSelectedUnit = convertAmountToSelectedUnit(
      this.measuringUnit,
      this.ingredient,
      this.recipiesService.products$.value
    );
    let amountPerSelectedPortions = this.getAmount(convertedToSelectedUnit);
    if (amountPerSelectedPortions % 1) {
      amountPerSelectedPortions = +amountPerSelectedPortions.toFixed(2);
    }
    if(amountPerSelectedPortions < 0.4 && isDegradable(this.measuringUnit)){
      this.measuringUnit = degradeToSmallerUnit(this.measuringUnit)
    }
    return amountPerSelectedPortions;
  }
  onAddPrep() {
    this.dialogsService
      .openAddPrepInstructionsDialog()
      .pipe(take(1))
      .subscribe((res) => {
        if (this._ingredient) {
          let cloned = _.cloneDeep(this._ingredient);
          if (cloned.prep) {
            cloned.prep.push(res);
          } else {
            cloned.prep = [res];
          }
          this.ingredientChanged.emit(cloned);
        }
      });
  }

  getTooltip(){
    let tooltip = 'Приготування заздалегіть: '
    if(this._ingredient && this._ingredient.prep){
      this._ingredient.prep.forEach(suggestion => {
        tooltip = tooltip.concat(suggestion + ' | ')
      })
    }
    return tooltip
  }
}
