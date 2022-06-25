import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSelectionList } from '@angular/material/list';
import * as _ from 'lodash';
import { RecipyMode } from 'src/app/recipies/containers/edit-recipy/edit-recipy.component';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';

@Component({
  selector: 'app-ingredients-to-list-bottomsheet',
  templateUrl: './ingredients-to-list-bottomsheet.component.html',
  styleUrls: ['./ingredients-to-list-bottomsheet.component.scss'],
})
export class IngredientsToListBottomsheetComponent implements AfterViewInit {
  RecipyMode = RecipyMode;

  @ViewChild('ingredients')
  ingredientsList: MatSelectionList | undefined;
  _ingredients = _.cloneDeep(this.data.ingredients);

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      ingredients: Ingredient[];
      portions: number;
      amountPerPortion: number;
      isMobile: boolean;
    },
    private _bottomSheetRef: MatBottomSheetRef<IngredientsToListBottomsheetComponent>
  ) {}
  ngAfterViewInit(): void {
    if (this.ingredientsList) {
      this.ingredientsList.selectAll();
    }
  }

  getSavedPortions(): number {
    let amount = 0;
    this.data.ingredients.forEach((ingr) => {
      amount = amount + ingr.amount;
    });
    let savedPortions = amount / this.data.amountPerPortion;
    return savedPortions;
  }

  onIngrChanged(event: Ingredient) {
    this._ingredients = this.data.ingredients.map((ingr) => {
      if (ingr.product == event.product) {
        return event;
      } else return ingr;
    });
  }

  add() {
    if (this.ingredientsList) {
      let selectedIds = this.ingredientsList.selectedOptions.selected.map(
        (option) => option.value
      );
      let selectedIngredients = this._ingredients.filter((ingr) =>
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
