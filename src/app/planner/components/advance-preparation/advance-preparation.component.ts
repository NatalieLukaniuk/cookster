import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { MeasuringUnit, MeasuringUnitText } from 'src/app/recipies/models/measuring-units.enum';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { NormalizeDisplayedAmount } from 'src/app/recipies/services/recipies.utils';
import { IAppState } from 'src/app/store/reducers';

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
}

export interface ISuggestionList {
  date: string;
  day: Date;
  suggestions: Suggestion[];
}

export class SuggestionList implements ISuggestionList {
  date: string;
  day: Date;
  suggestions: Suggestion[];
  constructor(day: Date) {
    this.day = day;
    this.suggestions = [];
    this.date = transformDate(day);
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
export class AdvancePreparationComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  plannedRecipies: DayDetails[] = [];
  suggestions: Suggestion[] = [];
  calendar: Day[] | undefined;
  dateRange: { startDate: string; endDate: string } | undefined;
  NormalizeDisplayedAmount = NormalizeDisplayedAmount;

  prepDate: any | undefined;
  lists: SuggestionList[] = [];

  constructor(
    private store: Store<IAppState>,
    private recipiesService: RecipiesService
  ) {}
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
    let suggestion: Suggestion = {
      productId: ingredient.product,
      productName: this.recipiesService.getIngredientText(ingredient),
      amount: ingredient.amount * coef,
      unit: ingredient.defaultUnit,
      prepDescription: prepDescription,
      recipyId: recipyId,
      recipyTitle: recipyName,
      day: day,
    };
    this.suggestions.push(suggestion);
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

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
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
    console.log(this.lists)
  }
}
