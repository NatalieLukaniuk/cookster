import { ProductType } from './../../../recipies/models/products.interface';
import { Component, Input, OnInit } from '@angular/core';
import { MeasuringUnit, MeasuringUnitOptionsFluid, MeasuringUnitOptionsGranular, MeasuringUnitOptionsHardHomogeneous, MeasuringUnitOptionsHardItems, MeasuringUnitOptionsHerbs, MeasuringUnitOptionsSpice, MeasuringUnitText } from 'src/app/recipies/models/measuring-units.enum';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { NormalizeDisplayedAmount } from 'src/app/recipies/services/recipies.utils';

@Component({
  selector: 'app-amount-in-selected-unit',
  templateUrl: './amount-in-selected-unit.component.html',
  styleUrls: ['./amount-in-selected-unit.component.scss']
})
export class AmountInSelectedUnitComponent implements OnInit {
  @Input()
  ingrId!: string;
  @Input()
  amountInGr!: number;
  @Input() unit: MeasuringUnit = 1;
  amountToDisplay: number = 0;
  selectedUnit: MeasuringUnit = 1;
  productType: ProductType = ProductType.fluid

  NormalizeDisplayedAmount = NormalizeDisplayedAmount;

  constructor(private recipiesService: RecipiesService) { }

  ngOnInit() {
    this.selectedUnit = this.unit;
    this.productType = this.recipiesService.getProductType(this.ingrId);
    this.amountToDisplay = this.recipiesService.getAmountInSelectedUnit(this.selectedUnit, this.ingrId, this.amountInGr)
  }

  get UnitText() {
    return MeasuringUnitText[this.selectedUnit];
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

  onValueChange(event: any) {
    this.selectedUnit = +event.target.value; //TODO: needs refactoring;
    this.amountToDisplay = this.recipiesService.getAmountInSelectedUnit(this.selectedUnit, this.ingrId, this.amountInGr)
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

}
