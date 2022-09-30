import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { ComplexityDescription } from 'src/app/recipies/models/complexity.enum';
import { DishType } from 'src/app/recipies/models/dishType.enum';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { PreparationStep } from 'src/app/recipies/models/preparationStep.interface';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { IAppState } from 'src/app/store/reducers';

import * as CalendarActions from '../../../store/actions/calendar.actions';
import {
  IngredientsToListBottomsheetComponent,
} from '../ingredients-to-list-bottomsheet/ingredients-to-list-bottomsheet.component';

export enum Details {
  Ingredients,
  Steps,
  Info,
  Prep
}
@Component({
  selector: 'app-calendar-recipy',
  templateUrl: './calendar-recipy.component.html',
  styleUrls: ['./calendar-recipy.component.scss'],
})
export class CalendarRecipyComponent implements OnInit {
  @Input() isMobile: boolean = false;
  @Input() recipy!: RecipyForCalendar;

  @Output() removeRecipy = new EventEmitter<RecipyForCalendar>();
  @Output() recipyUpdated = new EventEmitter<RecipyForCalendar>();
  @Output() saveToShoppingList = new EventEmitter<ShoppingListItem>();

  coef: number = 1;
  isShowIngredients: boolean = false;
  isShowSteps: boolean = false;
  isShowDetails: boolean = false;
  isShowPrepSuggestions: boolean = false;
  Details = Details;
  Math = Math;

  hasPrepSuggestions: boolean = false;
  showNeedsAdvancePreparation: boolean = false;

  suggestions: {ingr: string, text: string}[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private recipiesService: RecipiesService,
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this.getCoef();
    this.showNeedsAdvancePreparation = this.recipy.type.includes(DishType['потребує попередньої підготовки']);
    this.hasPrepSuggestions = !!this.recipy.ingrediends.find(ingr => !!ingr.prep);
    if(this.hasPrepSuggestions){
      this.recipy.ingrediends.forEach(ingr => {
        if(ingr.prep){
          ingr.prep.forEach(prep => this.suggestions.push({ingr: this.recipiesService.getIngredientText(ingr), text: prep}))
          
        }
      })
    }
  }
  viewRecipy() {
    if (this.isMobile) {
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
    } else {
      this.store.dispatch(
        new CalendarActions.PreviewRecipyAction(
          this.recipy,
          this.recipy.portions,
          this.recipy.amountPerPortion
        )
      );
    }
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
          // let shoppingListToSave: ShoppingListItem = {
          //   recipyId: this.recipy.id,
          //   ingredients: ingr,
          // };
          // this.saveToShoppingList.emit(shoppingListToSave);
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

  showDetails(section: Details) {
    switch (section) {
      case Details.Ingredients:
        {
          this.isShowIngredients = !this.isShowIngredients;
          this.isShowDetails = false;
          this.isShowSteps = false;
          this.isShowPrepSuggestions = false
        }
        break;
      case Details.Info:
        {
          this.isShowDetails = !this.isShowDetails;
          this.isShowIngredients = false;
          this.isShowSteps = false;
          this.isShowPrepSuggestions = false
        }
        break;
      case Details.Steps: {
        this.isShowSteps = !this.isShowSteps;
        this.isShowIngredients = false;
        this.isShowDetails = false;
        this.isShowPrepSuggestions = false
      }
      break;
      case Details.Prep: {
        this.isShowPrepSuggestions = !this.isShowPrepSuggestions;
        this.isShowIngredients = false;
        this.isShowDetails = false;
        this.isShowSteps = false;
      }
    }
  }

  get complexity() {
    return ComplexityDescription[this.recipy.complexity];
  }

  getTotalStepTime(step: PreparationStep) {
    return +step.timeActive + +step.timePassive;
  }

  get activeTime() {
    let time = 0;

    for (let step of this.recipy.steps) {
      time = time + +step.timeActive;
    }

    return time;
  }

  get passiveTime() {
    let time = 0;

    for (let step of this.recipy.steps) {
      time = time + +step.timePassive;
    }

    return time;
  }
}
