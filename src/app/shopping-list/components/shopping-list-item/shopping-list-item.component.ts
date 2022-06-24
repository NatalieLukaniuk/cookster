import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {
  MeasuringUnit,
  MeasuringUnitOptionsFluid,
  MeasuringUnitOptionsHardItems,
  MeasuringUnitOptionsHerbs,
  MeasuringUnitOptionsSpice,
  MeasuringUnitText,
} from 'src/app/recipies/models/measuring-units.enum';
import { Product, ProductType } from 'src/app/recipies/models/products.interface';

import { NoGroupListItem } from '../no-group-list/no-group-list.component';

@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.scss'],
})
export class ShoppingListItemComponent implements OnInit {
  @Input() item!: NoGroupListItem;
  @Input() allProducts!: Product[];
  _item: NoGroupListItem | undefined;

  constructor() {}

  ngOnInit(): void {
    this._item = _.cloneDeep(this.item);
  }

  onAmountChanged() {}

  onMeasurementUnitChanged(event: any) {
    if (this._item) {
      this._item = _.cloneDeep(this._item)
      this._item.defaultUnit = event;
    }
  }

  get productType() {
    let type: ProductType = ProductType.hardItem;
    if (this._item) {
      for (let product of this.allProducts) {
        if (product.id === this._item.product) {
          type = product.type;
        }
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
}
