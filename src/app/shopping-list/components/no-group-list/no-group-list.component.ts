import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { Product } from 'src/app/recipies/models/products.interface';
import { SEPARATOR } from 'src/app/shared/constants';
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

  @Output() listsUpdated = new EventEmitter<ShoppingListItem[]>();

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
      if(item.ingredients){
        item.ingredients.forEach((ingr: Ingredient) => {
        let itemToPush: NoGroupListItem = { ...ingr, lists: [] };
        if ('recipyId' in item) {
          let id = item.recipyId + SEPARATOR + item.day + SEPARATOR + item.meal
          itemToPush.lists!.push(id);
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
      }      
    });
  }

  onRemoveIngredient(event: NoGroupListItem) {
    this._lists = this._lists.map((list) => {
      let _list = _.cloneDeep(list);
      _list.ingredients = _list.ingredients.filter(
        (item) => item.product !== event.product
      );
      return _list;
    });
    this.listsUpdated.emit(this._lists);
  }

  onAmountChanged(event: NoGroupListItem) {
    let itemBeforeChange = this.listToDisplay.find(
      (item) => item.product == event.product
    );
    let amountDifference =
      this.round(itemBeforeChange!.amount) - this.round(event.amount);
    if (this.round(amountDifference)) {
      if (this.isAmountIncreased(amountDifference)) {
        //amount increased, the difference should be added to the general list - increased amount is processed properly

        if (itemBeforeChange!.lists.includes('general')) {
          //there is list general with the ingredient in it, amount should be changed there
          this._lists = this._lists.map((list) => {
            if (this.isGeneralList(list)) {
              let _list = _.cloneDeep(list);

              _list.ingredients = _list.ingredients.map((ingr) => {
                if (ingr.product == event.product) {
                  let ingrToReturn: Ingredient = {
                    product: event.product,
                    defaultUnit: event.defaultUnit,
                    amount: ingr.amount + Math.abs(amountDifference),
                  };
                  return ingrToReturn;
                } else return ingr;
              });
              return _list;
            } else return list;
          });
          this.listsUpdated.emit(this._lists);
        } else {
          //the ingredient is not included in list general
          let ingrToAdd: Ingredient = {
            product: event.product,
            amount: Math.abs(amountDifference),
            defaultUnit: event.defaultUnit,
          };
          if (this._lists.find((list) => this.isGeneralList(list))) {
            //if the list general exists, the ingredient should be added to it
            this._lists = this._lists.map((list) => {
              if (this.isGeneralList(list)) {
                let _list = _.cloneDeep(list)

                if(!_list.ingredients){
                  _list.ingredients = []
                }
                _list.ingredients.push(ingrToAdd);
                return _list;
              } else return list;
            });
            this.listsUpdated.emit(this._lists);
          } else {
            // if the list general doesn't exist, it should be created and the ingredient should be added to it
            let newList: ShoppingListItem = {
              ingredients: [ingrToAdd],
              listName: 'general',
            };
            this._lists.push(newList);
            this.listsUpdated.emit(this._lists);
          }
        }
      } else {
        //amount decreased
        let amountToProcess = Math.abs(this.round(amountDifference));
        if (itemBeforeChange!.lists.includes('general')) {
          //there is a list general with the ingredient in it
          if (
            this._lists.find(
              (list) =>
                this.isGeneralList(list) &&
                list.ingredients.find((ingr) => (ingr.product == event.product && ingr.amount > amountToProcess))
            )
          ) {
            // the amount of the ingredient in the general list is bigger than the amount to process, the amount should be decreased
            this._lists = this._lists.map((list) => {
              if (this.isGeneralList(list)) {
                let _list = _.cloneDeep(list);
                _list.ingredients = _list.ingredients.map((ingr) => {
                  if (ingr.product == event.product) {
                    let ingrToReturn: Ingredient = {
                      product: event.product,
                      defaultUnit: event.defaultUnit,
                      amount: ingr.amount - amountToProcess,
                    };
                    return ingrToReturn;
                  } else return ingr;
                });
                return _list;
              } else return list;
            });
            this.listsUpdated.emit(this._lists);
          } else if (
            this._lists.find(
              (list) =>
                this.isGeneralList(list) &&
                list.ingredients.find((ingr) => (ingr.product == event.product && ingr.amount == amountToProcess))
            )
          ) {
            // the amount of the ingredient in the general list is equal to the amount to process, the ingredient should be removed from the general list
            this._lists = this.removeIngredientFromGeneralList(event);
            this.listsUpdated.emit(this._lists);
          } else {
            // the amount of the ingredient in the general list is smaller than the amount to process,
            //the ingredient should be removed from the general list and the remaining difference processed further
            this._lists.forEach((list) => {
              if (this.isGeneralList(list)) {
                let ingrToRemove = list.ingredients.find(
                  (ingr) => (ingr.product == event.product)
                );
                amountToProcess = amountToProcess - ingrToRemove!.amount;
              }
            });
            this._lists = this.removeIngredientFromGeneralList(event);
            if (amountToProcess) {
              this.findAndProcessInList(amountToProcess, event, 0)
            } else {
              //save lists
              this.listsUpdated.emit(this._lists);
            }
          }
        } else {
          //there is no ingr in general list, needs to be decreased in recipies - the names are in event.lists[]
          this.findAndProcessInList(amountToProcess, event, 0)
        }
      }
    }
  }

  isGeneralList(list: ShoppingListItem): boolean {
    return 'listName' in list && list.listName == 'general';
  }

  isListById(list: ShoppingListItem, id: string): boolean {
    let split = id.split(SEPARATOR)

    return 'recipyId' in list && list.recipyId == split[0] && list.day == split[1] && list.meal == split[2];
  }

  findAndProcessInList(
    amountToProcess: number,
    event: NoGroupListItem,
    recipyIndex: number
  ) {
    if (
      this._lists.find(
        (list) =>
          this.isListById(list, event.lists[recipyIndex]) &&
          list.ingredients.find((ingr) => (ingr.product == event.product && ingr.amount > amountToProcess))
      )
    ) {
      // the amount of the ingredient in the list is bigger than the amount to process, the amount should be decreased
      this._lists = this._lists.map((list) => {
        if (this.isListById(list, event.lists[recipyIndex])) {
          let _list = _.cloneDeep(list);
          _list.ingredients = _list.ingredients.map((ingr) => {
            if (ingr.product == event.product) {
              let ingrToReturn: Ingredient = {
                product: event.product,
                defaultUnit: event.defaultUnit,
                amount: ingr.amount - amountToProcess,
              };
              return ingrToReturn;
            } else return ingr;
          });
          return _list;
        } else return list;
      });
      this.listsUpdated.emit(this._lists);
    } else if (
      this._lists.find(
        (list) =>
          this.isListById(list, event.lists[recipyIndex]) &&
          list.ingredients.find((ingr) => (ingr.product == event.product && ingr.amount == amountToProcess))
      )
    ) {
      // the amount of the ingredient in the  list is equal to the amount to process, the ingredient should be removed from the list
      this._lists = this.removeFromListById(event, event.lists[recipyIndex]);
      this.listsUpdated.emit(this._lists);
    } else {
      // the amount of the ingredient in the list is smaller than the amount to process,
      //the ingredient should be removed from the list and the remaining difference processed further
      this._lists.forEach((list) => {
        if (this.isListById(list, event.lists[recipyIndex])) {
          let ingrToRemove = list.ingredients.find(
            (ingr) => (ingr.product == event.product)
          );
          if(ingrToRemove){
            amountToProcess = amountToProcess - ingrToRemove!.amount;            
          }          
        }
      });
      this._lists = this.removeFromListById(event, event.lists[recipyIndex]);
      this.listsUpdated.emit(this._lists);
      if (amountToProcess) {
        this.findAndProcessInList(amountToProcess, event, recipyIndex + 1)
      } else {
        //save lists
        this.listsUpdated.emit(this._lists);
      }
    }
  }

  removeFromListById(event: Ingredient, recipyId: string): ShoppingListItem[] {
    let listsToReturn = this._lists.map((list) => {
      if (this.isListById(list, recipyId)) {
        let _list = _.cloneDeep(list);
        _list.ingredients = _list.ingredients.filter(
          (ingr) => ingr.product !== event.product
        );
        return _list;
      } else return list;
    });
    return listsToReturn;
  }

  removeIngredientFromGeneralList(event: Ingredient): ShoppingListItem[] {
    let listsToReturn = this._lists.map((list) => {
      if (this.isGeneralList(list)) {
        let _list = _.cloneDeep(list);
        _list.ingredients = _list.ingredients.filter(
          (ingr) => ingr.product !== event.product
        );
        return _list;
      } else return list;
    });
    return listsToReturn;
  }

  isAmountIncreased(amount: number): boolean {
    return amount < 0;
  }

  normalizeDecimals(amount: number): number {
    return Math.fround(amount);
  }

  round(amount: number): number {
    return Math.round(amount);
  }

  onMeasuringUnitChanged(event: NoGroupListItem) {}
}
