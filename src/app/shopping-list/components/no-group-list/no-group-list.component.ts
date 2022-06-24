import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { Product } from 'src/app/recipies/models/products.interface';
import { ShoppingListItem } from 'src/app/shopping-list/models';

export interface NoGroupListItem extends Ingredient {
  lists: string[];
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
  listToDisplay: NoGroupListItem[] = [];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lists && changes.lists.currentValue) {
      this._lists = this.lists.map((item) => item);
      this.buildListToDisplay();
    }
  }

  ngOnInit(): void {}

  buildListToDisplay() {
    this.listToDisplay = [];
    this._lists.forEach((item: ShoppingListItem) => {
      item.ingredients.forEach((ingr: Ingredient) => {
        let itemToPush: NoGroupListItem = { ...ingr, lists: [] };
        if ('recipyId' in item) {
          itemToPush.lists!.push(item.recipyId!);
        } else if ('listName' in item) {
          itemToPush.lists!.push(item.listName!);
        }
        if (
          !this.listToDisplay.find(
            (listItem) => listItem.product == itemToPush.product
          )
        ) {
          this.listToDisplay.push(itemToPush);
        } else {
          this.listToDisplay = this.listToDisplay.map((listItem) => {
            if (listItem.product == itemToPush.product) {
              let updated: NoGroupListItem = {
                product: listItem.product,
                defaultUnit: listItem.defaultUnit,
                amount: listItem.amount + itemToPush.amount,
                lists: listItem.lists,
              };
              itemToPush.lists.forEach((list) => {
                if (!listItem.lists.includes(list)) {
                  updated.lists.push(list);
                }
              });
              return updated;
            } else return listItem;
          });
        }
      });
    });
    console.log(this.listToDisplay);
  }
}
