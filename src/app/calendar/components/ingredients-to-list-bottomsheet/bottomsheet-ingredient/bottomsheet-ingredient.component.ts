import { Component, Input, OnInit } from '@angular/core';
import {
  MeasuringUnit,
  MeasuringUnitOptionsFluid,
  MeasuringUnitOptionsGranular,
  MeasuringUnitOptionsHardHomogeneous,
  MeasuringUnitOptionsHardItems,
  MeasuringUnitOptionsHerbs,
  MeasuringUnitOptionsSpice,
  MeasuringUnitText,
} from 'src/app/recipies/models/measuring-units.enum';
import { ProductType } from 'src/app/recipies/models/products.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { convertAmountToSelectedUnit, NormalizeDisplayedAmount } from 'src/app/recipies/services/recipies.utils';
import { ShoppingListItem } from 'src/app/shopping-list/models';

@Component({
  selector: 'app-bottomsheet-ingredient',
  templateUrl: './bottomsheet-ingredient.component.html',
  styleUrls: ['./bottomsheet-ingredient.component.scss']
})
export class BottomsheetIngredientComponent implements OnInit {
  @Input() ingredient!: ShoppingListItem;
  @Input() isMobile!: boolean;

  _amountInSelectedUnit: number = 0;

  NormalizeDisplayedAmount = NormalizeDisplayedAmount;
  measuringUnit: MeasuringUnit = MeasuringUnit.gr;
  
  constructor(private recipiesService: RecipiesService) { }

  ngOnInit() {
    this._amountInSelectedUnit = convertAmountToSelectedUnit(
      this.ingredient.defaultUnit,
      this.ingredient,
      this.recipiesService.products$.value
    );
    this.measuringUnit = this.ingredient.defaultUnit;
  }

  getIngredientText(): string {
    return this.recipiesService.getIngredientText(this.ingredient);
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  get amountToDisplay() {
    const convertedToSelectedUnit = convertAmountToSelectedUnit(
      this.measuringUnit,
      this.ingredient,
      this.recipiesService.products$.value
    );
    
    return convertedToSelectedUnit;
  }

  onValueChange(event: any) {
    this.measuringUnit = +event.target.value; //TODO: needs refactoring
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

}
