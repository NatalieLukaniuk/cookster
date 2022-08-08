import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSelectionList } from '@angular/material/list';
import { AppMode } from 'src/app/recipies/containers/edit-recipy/edit-recipy.component';
import { ShoppingListItem } from 'src/app/shopping-list/models';

@Component({
  selector: 'app-ingredients-to-list-bottomsheet',
  templateUrl: './ingredients-to-list-bottomsheet.component.html',
  styleUrls: ['./ingredients-to-list-bottomsheet.component.scss'],
})
export class IngredientsToListBottomsheetComponent
  implements AfterViewInit, OnInit
{
  AppMode = AppMode;

  @ViewChild('ingredients')
  ingredientsList: MatSelectionList | undefined;

  listToDisplay: ShoppingListItem[] = [];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      shoppingItemsList: ShoppingListItem[];
      isMobile: boolean;
    },
    private _bottomSheetRef: MatBottomSheetRef<IngredientsToListBottomsheetComponent>
  ) {}

  ngOnInit(): void {
    this.data.shoppingItemsList.forEach((item) => {
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
  }
  ngAfterViewInit(): void {
    if (this.ingredientsList) {
      this.ingredientsList.selectAll();
    }
  }

  add() {
    if (this.ingredientsList) {
      let selectedIds = this.ingredientsList.selectedOptions.selected.map(
        (option) => option.value
      );
      let selectedIngredients = this.data.shoppingItemsList.filter((ingr) =>
        selectedIds.includes(ingr.product)
      );
      this._bottomSheetRef.dismiss(selectedIngredients);
    }
  }

  toggleAllSelected(event: boolean) {
    if (this.ingredientsList) {
      !event
        ? this.ingredientsList?.deselectAll()
        : this.ingredientsList?.selectAll();
    }
  }
}
