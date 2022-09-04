import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { MeasuringUnit } from 'src/app/recipies/models/measuring-units.enum';
import { Product } from 'src/app/recipies/models/products.interface';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { convertAmountToSelectedUnit } from 'src/app/recipies/services/recipies.utils';
import { IAppState } from 'src/app/store/reducers';

import * as UserActions from '../../../store/actions/user.actions';
import { DayDetails } from './../../../calendar/models/calendar';
import { getCalendar } from './../../../store/selectors/calendar.selectors';

export interface Suggestion {
  productId: string;
  productName: string;
  amount: number;
  unit: MeasuringUnit;
  prepDescription: string;
  recipyId: string;
  recipyTitle: string;
  day: Date;
  done?: boolean
}

export class SuggestionCard implements Suggestion{
  productId: string;
  productName: string;
  amount: number;
  unit: MeasuringUnit;
  prepDescription: string;
  recipyId: string;
  recipyTitle: string;
  day: Date;
  done?: boolean = false;
constructor(suggestion: Suggestion){
  this.productId = suggestion.productId;
  this.productName = suggestion.productName;
  this.amount = suggestion.amount;
  this.unit = suggestion.unit;
  this.prepDescription = suggestion.prepDescription;
  this.recipyId = suggestion.recipyId;
  this.recipyTitle = suggestion.recipyTitle;
  this.day = suggestion.day;
}
}

export interface ISuggestionList {
  date: string;
  day: Date;
  suggestions: Suggestion[];
}

export class SuggestionList implements ISuggestionList {
  date: string;
  day: Date;
  suggestions: Suggestion[] | SuggestionCard[];
  isExpanded: boolean;
  constructor(day: Date) {
    this.day = day;
    this.suggestions = [];
    this.date = transformDate(day);
    this.isExpanded = true;
  }
}

export function transformDate(date: Date): string {
  return (
    getTwoDigitValue(date.getDate().toString()) +
    getTwoDigitValue((date.getMonth() + 1).toString()) +
    date.getFullYear().toString()
  );
}
export function getTwoDigitValue(value: string): string {
  if (value.length < 2) {
    return '0' + value;
  } else return value;
}
@Component({
  selector: 'app-advance-preparation',
  templateUrl: './advance-preparation.component.html',
  styleUrls: ['./advance-preparation.component.scss'],
})
export class AdvancePreparationComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() currentUser: User | null | undefined;
  @Input() allProducts!: Product[] | null;
  destroyed$ = new Subject();
  plannedRecipies: DayDetails[] = [];
  suggestions: Suggestion[] = [];
  calendar: Day[] | undefined;
  dateRange: { startDate: string; endDate: string } | undefined;

  prepDate: any | undefined;
  lists: SuggestionList[] = [];

  isListsChanged = false;

  constructor(
    private store: Store<IAppState>,
    private recipiesService: RecipiesService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentUser && this.currentUser?.prepLists) {
      this.lists = _.cloneDeep(this.currentUser.prepLists);
    }
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {
    this.store
      .pipe(select(getCalendar), takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.calendar = res;
        }
      });
  }

  findPrep(calendar: Day[]) {
    this.suggestions = [];
    calendar.forEach((day: Day) => {
      if (day.details.breakfastRecipies.length) {
        day.details.breakfastRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
      if (day.details.lunchRecipies.length) {
        day.details.lunchRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
      if (day.details.dinnerRecipies.length) {
        day.details.dinnerRecipies.forEach((recipy: RecipyForCalendar) => {
          recipy.ingrediends.forEach((ingr) => {
            if (ingr.prep) {
              ingr.prep.forEach((text) => {
                this.addSuggestion(
                  ingr,
                  this.recipiesService.getCoeficient(
                    recipy.ingrediends,
                    recipy.portions,
                    recipy.amountPerPortion
                  ),
                  text,
                  recipy.id,
                  recipy.name,
                  day.value.toDate()
                );
              });
            }
          });
        });
      }
    });
  }

  addSuggestion(
    ingredient: Ingredient,
    coef: number,
    prepDescription: string,
    recipyId: string,
    recipyName: string,
    day: Date
  ) {
    if (this.allProducts) {
      let suggestion: Suggestion = {
        productId: ingredient.product,
        productName: this.recipiesService.getIngredientText(ingredient),
        amount: convertAmountToSelectedUnit(
          ingredient.defaultUnit,
          { ...ingredient, amount: ingredient.amount * coef },
          this.allProducts
        ),
        unit: ingredient.defaultUnit,
        prepDescription: prepDescription,
        recipyId: recipyId,
        recipyTitle: recipyName,
        day: day,
      };
      this.suggestions.push(suggestion);
    }
  }

  onDateSelected(event: { startDate: string; endDate: string }) {
    if (event) {
      this.dateRange = event;
      if (this.calendar) {
        let calendarWithingDateRange = this.calendar.filter(
          (day) =>
            +day.details.day >= +event.startDate &&
            +day.details.day <= +event.endDate
        );
        this.findPrep(calendarWithingDateRange);
      }
    }
  }

  createPrepList(event: any) {
    let newList = new SuggestionList(event);
    this.lists.push(newList);
    console.log(newList);
  }
  drop(event: CdkDragDrop<Suggestion[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.isListsChanged = true;
    console.log(this.lists);
  }
  saveLists() {
    if (this.currentUser) {
      let updatedUser: User = {
        ...this.currentUser,
        prepLists: this.lists,
      };
      this.isListsChanged = false;
      this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }
  }
  deleteList(list: SuggestionList) {
    this.lists = this.lists.filter((item) => item.date !== list.date);
    if (this.currentUser) {
      let updatedUser: User = {
        ...this.currentUser,
        prepLists: this.lists,
      };
      this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }
  }
  onRemoveItem(event: Suggestion, list: SuggestionList) {
    this.lists = this.lists.map((el) => {
      if (el.date == list.date) {
        return {
          ...el,
          suggestions: el.suggestions.filter(
            (sugg) => sugg.prepDescription !== event.prepDescription
          ),
        };
      } else return el;
    });
    this.isListsChanged = true;
  }
}
