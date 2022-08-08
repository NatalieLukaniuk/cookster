import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { Product } from 'src/app/recipies/models/products.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { ShoppingListItem } from 'src/app/shopping-list/models';

export interface NoGroupListItem extends Ingredient {
  lists: string[];
  order?: number;
}
@Component({
  selector: 'app-no-group-list',
  templateUrl: './no-group-list.component.html',
  styleUrls: ['./no-group-list.component.scss'],
})
export class NoGroupListComponent implements OnChanges {
  @Input() lists!: ShoppingListItem[];
  @Input() allProducts!: Product[];
  _lists: ShoppingListItem[] = [];
  listToDisplay: ShoppingListItem[] = [];

  @Output() listsUpdated = new EventEmitter<ShoppingListItem[]>();

  constructor(private recipiesService: RecipiesService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lists && changes.lists.currentValue) {
      this._lists = this.lists.map((item) => item);
      this.buildListToDisplay();
    }
  }

  ngOnInit(): void {}

  buildListToDisplay() {
    this.listToDisplay = [];
    this.lists.forEach((item) => {
      if (
        !this.listToDisplay.find((element) => element.product === item.product)
      ) {
        this.listToDisplay.push(item);
      } else {
        this.listToDisplay = this.listToDisplay.map((element) => {
          if (element.product === item.product) {
            return {
              product: element.product,
              amount: element.amount + item.amount,
              defaultUnit: element.defaultUnit,
              recipyId: item.recipyId
                ? element.recipyId!.concat(item.recipyId)
                : element.recipyId,
              day: item.day ? element.day!.concat(item.day) : element.day,
            };
          } else return element;
        });
      }
    });
    this.listToDisplay = this.listToDisplay.map((item) => ({
      ...item,
      productName: this.recipiesService.getIngredientText(item),
    }));
    this.listToDisplay.sort((a, b) =>
      a.productName!.localeCompare(b.productName!)
    );
  }

  onRemoveIngredient(event: ShoppingListItem) {
    this.listToDisplay = this.listToDisplay.filter(
      (item) => item.product !== event.product
    );
    this.listsUpdated.emit(this.listToDisplay);
  }

  onAmountChanged(event: { item: ShoppingListItem; isSmallAmount: boolean }) {
    let itemBeforeChange = this.listToDisplay.find(
      (item) => item.product == event.item.product
    );
    let amountDifference: number = this.getAmountDifference(
      itemBeforeChange!.amount,
      event.item.amount,
      event.isSmallAmount
    );

    if (amountDifference) {
      if (this.isAmountIncreased(amountDifference)) {
        this.onAmountIncreased(itemBeforeChange!, amountDifference);
      } else {
        this.onAmountDecreased(itemBeforeChange!, amountDifference);
      }
    }
  }

  onAmountIncreased(originalItem: ShoppingListItem, amountDifference: number) {
    if (
      this.listToDisplay.find(
        (item) =>
          item.product == originalItem.product && item.listName == 'general'
      )
    ) {
      this.listToDisplay = this.listToDisplay.map((item) => {
        if (
          item.product == originalItem.product &&
          item.listName == 'general'
        ) {
          return {
            product: originalItem.product,
            amount: item.amount + Math.abs(amountDifference),
            defaultUnit: originalItem.defaultUnit,
            listName: item.listName,
            productName: item.productName,
          };
        } else return item;
      });
    } else {
      this.listToDisplay.push({
        product: originalItem.product,
        amount: Math.abs(amountDifference),
        defaultUnit: originalItem.defaultUnit,
        listName: 'general',
      });
      this.listsUpdated.emit(this.listToDisplay);
    }
  }

  onAmountDecreased(
    originalItem: ShoppingListItem,
    amountDifference: number
  ) {
    let amountToProcess = Math.abs(amountDifference);
    let itemInGeneralList = this.listToDisplay.find(
      (item) =>
        item.product == originalItem.product && item.listName == 'general'
    )
    if(itemInGeneralList){
      let index = this.listToDisplay.findIndex((item) =>
      item.product == originalItem.product && item.listName == 'general');
      if(this.listToDisplay[index].amount > amountToProcess){
        this.listToDisplay[index].amount = this.listToDisplay[index].amount - amountToProcess;
      } else if (this.listToDisplay[index].amount == amountToProcess){
        this.listToDisplay.splice(index,1);
      } else {
        amountToProcess = amountToProcess - this.listToDisplay[index].amount;
        this.listToDisplay.splice(index, 1);
        this.listToDisplay = this.deleteProductRecursively(this.listToDisplay, originalItem, amountToProcess)
      }
    } else this.listToDisplay = this.deleteProductRecursively(this.listToDisplay, originalItem, amountToProcess);
    this.listsUpdated.emit(this.listToDisplay);
  }

  deleteProductRecursively(
    list: ShoppingListItem[],
    originalItem: ShoppingListItem,
    amountToProcess: number
  ): ShoppingListItem[] {
    let index = list.findIndex((item) => item.product == originalItem.product);
    let listToReturn: ShoppingListItem[] = [];
    if (list[index].amount > amountToProcess) {
      list[index].amount = list[index].amount - amountToProcess;
      listToReturn = list
    } else if (list[index].amount == amountToProcess) {
      list.splice(index, 1);
      listToReturn = list
    } else if (list[index].amount < amountToProcess) {
      amountToProcess = amountToProcess - list[index].amount;
      list.splice(index, 1);
      listToReturn = this.deleteProductRecursively(list, originalItem, amountToProcess);
    }
    return listToReturn;
  }

  getAmountDifference(
    originalAmount: number,
    updatedAmount: number,
    isSmallAmount: boolean
  ): number {
    if (originalAmount > 1 && updatedAmount > 1 && !isSmallAmount) {
      return this.round(originalAmount) - this.round(updatedAmount);
    } else {
      return originalAmount - updatedAmount;
    }
  }

  isAmountIncreased(amount: number): boolean {
    return amount < 0;
  }

  round(amount: number): number {
    return Math.round(amount);
  }

  onMeasuringUnitChanged(event: ShoppingListItem) {}
}
