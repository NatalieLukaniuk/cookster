import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { ShoppingListItem } from 'src/app/shopping-list/models';

import {
  IngredientsToListBottomsheetComponent,
} from '../ingredients-to-list-bottomsheet/ingredients-to-list-bottomsheet.component';

@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss'],
})
export class CalendarRecipyComponent implements OnInit {
  @Input() isMobile: boolean = false;
  @Input() recipy!: RecipyForCalendar;
  @Input()
  isSidePane!: boolean;

  @Output() removeRecipy = new EventEmitter<RecipyForCalendar>();
  @Output() recipyUpdated = new EventEmitter<RecipyForCalendar>();
  @Output() saveToShoppingList = new EventEmitter<ShoppingListItem>();

  coef: number = 1;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private recipiesService: RecipiesService
  ) {}

  ngOnInit(): void {
    this.getCoef();
  }
  viewRecipy() {
    this.router.navigate(
      ['cookster', 'recipies', 'full-recipy', this.recipy.id],
      {
        relativeTo: this.route.parent,
        state: {
          portions: this.recipy.portions,
          amountPerportion: this.recipy.amountPerPortion,
        },
      }
    );
  }

  onRemoveRecipy() {
    this.removeRecipy.emit(this.recipy);
  }

  addToShoppingList() {
    const bottomSheetRef = this._bottomSheet.open(
      IngredientsToListBottomsheetComponent,
      {
        data: {
          ingredients: this.recipy.ingrediends,
          portions: this.recipy.portions,
          amountPerPortion: this.recipy.amountPerPortion,
          isMobile: this.isMobile,
        },
      }
    );

    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((res: Ingredient[]) => {
        if (!!res) {
          let ingr = this.recalculateIngredients(res);
          let shoppingListToSave: ShoppingListItem = {
            recipyId: this.recipy.id,
            ingredients: ingr,
          };
          this.saveToShoppingList.emit(shoppingListToSave);
        }
      });
  }

  onAmountPerPortionChanged() {
    this.recipyUpdated.emit(this.recipy);
  }

  getCoef() {
    let totalAmount = 0;
    this.recipy.ingrediends.forEach((ingr) => {
      if (
        this.recipiesService.getIsIngredientIncludedInAmountCalculation(ingr)
      ) {
        totalAmount = totalAmount + ingr.amount;
      }
    });
    this.coef =
      (this.recipy.portions * this.recipy.amountPerPortion) / totalAmount;
  }

  recalculateIngredients(ingredientsList: Ingredient[]): Ingredient[] {
    let ingrListToreturn = ingredientsList.map((ingr) => {
      ingr.amount = ingr.amount * this.coef;
      return ingr;
    });
    return ingrListToreturn;
  }
}
