import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AppMode } from 'src/app/recipies/containers/edit-recipy/edit-recipy.component';
import {
  MeasuringUnit,
  MeasuringUnitOptionsFluid,
  MeasuringUnitOptionsHardItems,
  MeasuringUnitOptionsHerbs,
  MeasuringUnitOptionsSpice,
  MeasuringUnitText,
} from 'src/app/recipies/models/measuring-units.enum';
import { Product, ProductType } from 'src/app/recipies/models/products.interface';
import {
  convertAmountToSelectedUnit,
  NormalizeDisplayedAmount,
  transformToGr,
} from 'src/app/recipies/services/recipies.utils';

import { NoGroupListItem } from '../no-group-list/no-group-list.component';
import {
  MeasuringUnitOptionsGranular,
  MeasuringUnitOptionsHardHomogeneous,
} from './../../../recipies/models/measuring-units.enum';

enum ChangeType {
  amount,
  measuringUnit,
}
@Component({
  selector: 'app-shopping-list-item',
  templateUrl: './shopping-list-item.component.html',
  styleUrls: ['./shopping-list-item.component.scss'],
})
export class ShoppingListItemComponent implements OnInit, OnDestroy {
  @Input() item!: NoGroupListItem;
  @Input() allProducts!: Product[];
  _item: NoGroupListItem | undefined;
  _measuringUnit: MeasuringUnit | undefined;
  _amountToDisplay: number = 0;

  mode = AppMode.ShoppingList;
  itemChanged$ = new Subject<{ item: NoGroupListItem; change: ChangeType; isSmallAmount: boolean }>();
  destroyed$ = new Subject();

  NormalizeDisplayedAmount = NormalizeDisplayedAmount;

  @Output() removeIngredient = new EventEmitter<NoGroupListItem>();
  @Output() amountChanged = new EventEmitter<{item: NoGroupListItem, isSmallAmount: boolean}>();
  @Output() measuringUnitChanged = new EventEmitter<NoGroupListItem>();

  constructor() {}
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this._item = _.cloneDeep(this.item);
    this._measuringUnit = this._item.defaultUnit;
    this._amountToDisplay = convertAmountToSelectedUnit(
      this._measuringUnit,
      this._item,
      this.allProducts
    );
    if (this._amountToDisplay % 1) {
      this._amountToDisplay = NormalizeDisplayedAmount(this._amountToDisplay, this._measuringUnit);
    }
    this.itemChanged$
      .pipe(takeUntil(this.destroyed$), debounceTime(700))
      .subscribe((update: { item: NoGroupListItem; change: ChangeType, isSmallAmount: boolean }) => {
        switch (update.change) {
          case ChangeType.amount:
            this.amountChanged.emit({item: update.item, isSmallAmount: update.isSmallAmount});
            break;
          case ChangeType.measuringUnit:
            this.measuringUnitChanged.emit(update.item);
        }
      });
  }

  onAmountChanged() {
    if (this._item && this._measuringUnit) {
      this._item.amount = transformToGr(
        this._item,
        this._amountToDisplay,
        this._measuringUnit,
        this.allProducts
      );
      let isSmallAmount = this.getIsSmallAmount()
      this.itemChanged$.next({ item: this._item, change: ChangeType.amount, isSmallAmount: isSmallAmount  });
    }
  }

  getIsSmallAmount(): boolean{
    return (this._measuringUnit == MeasuringUnit.pinch || this._measuringUnit == MeasuringUnit.teaSpoon || this._measuringUnit == MeasuringUnit.coffeeSpoon || (this._item!.amount < 1 || this._amountToDisplay < 1))
  }

  onMeasurementUnitChanged(event: MeasuringUnit) {
    if (this._item) {
      this._item = _.cloneDeep(this._item);
      this._item.defaultUnit = event;
      this.itemChanged$.next({item: this._item, change: ChangeType.measuringUnit, isSmallAmount: this.getIsSmallAmount()});
      // this._measuringUnit = event;
      // this._amountToDisplay = convertAmountToSelectedUnit(
      //   this._measuringUnit,
      //   this._item,
      //   this.allProducts
      // );
      // if (this._amountToDisplay % 1) {
      //   this._amountToDisplay = +this._amountToDisplay.toFixed(2);
      // }
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

  removeIngr() {
    this.removeIngredient.emit(this.item);
  }
}
