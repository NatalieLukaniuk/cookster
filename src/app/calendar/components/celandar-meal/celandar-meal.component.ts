import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import {
  Recipy,
  RecipyForCalendar,
} from 'src/app/recipies/models/recipy.interface';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { MoveRecipyInCalendarAction } from 'src/app/store/actions/calendar.actions';
import { IAppState } from 'src/app/store/reducers';
import { getCalendar } from 'src/app/store/selectors/calendar.selectors';
import { CalendarMode } from '../calendar-by-month/calendar-by-month.component';

import { Day } from '../calendar/calendar.component';

export enum MealTime {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
}

@Component({
  selector: 'app-celandar-meal',
  templateUrl: './celandar-meal.component.html',
  styleUrls: ['./celandar-meal.component.scss'],
})
export class CelandarMealComponent implements OnChanges {
  @Input() day!: Day;
  @Input() isMobile!: boolean;
  @Input() mealtime!: MealTime;
  @Input() mode: CalendarMode = CalendarMode.Other;
  @Output() addRecipy = new EventEmitter<{
    day: Day;
    meal: string;
    recipyId: string;
  }>();
  @Output() updateRecipy = new EventEmitter<{
    recipy: RecipyForCalendar;
    mealtime: MealTime;
  }>();
  @Output() removeRecipy = new EventEmitter<{
    recipy: Recipy;
    mealtime: MealTime;
  }>();
  @Output() saveToShoppingList = new EventEmitter<{
    item: ShoppingListItem;
    mealtime: MealTime;
  }>();
  @Output() mealTimeUpdated = new EventEmitter<Day>();

  CalendarMode = CalendarMode;

  _day: Day | undefined;
  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.day.currentValue) {
      this._day = _.cloneDeep(this.day);
    }
  }

  drop(event: CdkDragDrop<Recipy[]> | CdkDragDrop<RecipyForCalendar[]>) {
    if (this._day) {
      if (event.previousContainer.id.includes('cdk-drop-list')) {
        this.addRecipy.emit({
          day: this._day,
          meal: event.container.id,
          recipyId: event.item.element.nativeElement.id,
        });
      } else {
        let previousDayId = event.previousContainer.id.split('_');
        let currentDay = event.container.id.split('_');

        this.store.pipe(select(getCalendar), take(1)).subscribe((calendar) => {
          if (calendar) {
            let foundDay = calendar.find(
              (day) => day.details.day == previousDayId[1]
            );
            if (foundDay) {
              let foundRecipy = this.findRecipy(
                foundDay,
                previousDayId[0] as MealTime,
                event.item.element.nativeElement.id
              );
              if (foundRecipy) {
                this.store.dispatch(
                  new MoveRecipyInCalendarAction(
                    {
                      recipyId: foundRecipy.id,
                      portions: foundRecipy.portions,
                      amountPerPortion: foundRecipy.amountPerPortion,
                    },
                    {
                      day: previousDayId[1],
                      mealtime: previousDayId[0] as MealTime,
                    },
                    {
                      day: currentDay[1],
                      mealtime: currentDay[0] as MealTime,
                      order: event.currentIndex,
                    }
                  )
                );
              }
            }
          }
        });
      }
    }
  }

  findRecipy(day: Day, mealtime: MealTime, recipyId: string) {
    switch (mealtime) {
      case MealTime.Breakfast:
        return day.details.breakfastRecipies.find(
          (recipy) => recipy.id == recipyId
        );
      case MealTime.Lunch:
        return day.details.lunchRecipies.find(
          (recipy) => recipy.id == recipyId
        );
      case MealTime.Dinner:
        return day.details.dinnerRecipies.find(
          (recipy) => recipy.id == recipyId
        );
    }
  }

  getPortions(): number | null {
    if (this._day) {
      if (this._day.details) {
        switch (this.mealtime) {
          case MealTime.Breakfast:
            return !!this._day.details.breakfastRecipies[0]
              ? this._day.details.breakfastRecipies[0].portions
              : null;
          case MealTime.Lunch:
            return !!this._day.details.lunchRecipies[0]
              ? this._day.details.lunchRecipies[0].portions
              : null;
          case MealTime.Dinner:
            return !!this.day.details.dinnerRecipies[0]
              ? this._day.details.dinnerRecipies[0].portions
              : null;
          default:
            return null;
        }
      } else return null;
    } else return null;
  }

  getAmountPerPerson() {
    if (this._day && this._day.details) {
      switch (this.mealtime) {
        case MealTime.Breakfast: {
          let amount = 0;
          if (!!this._day.details.breakfastRecipies.length) {
            this._day.details.breakfastRecipies.forEach(
              (recipy: RecipyForCalendar) => {
                amount = amount + recipy.amountPerPortion;
              }
            );
          }
          return amount;
        }
        case MealTime.Lunch: {
          let amount = 0;
          if (!!this._day.details.lunchRecipies.length) {
            this._day.details.lunchRecipies.forEach(
              (recipy: RecipyForCalendar) => {
                amount = amount + recipy.amountPerPortion;
              }
            );
          }
          return amount;
        }
        case MealTime.Dinner: {
          let amount = 0;
          if (!!this._day.details.dinnerRecipies.length) {
            this._day.details.dinnerRecipies.forEach(
              (recipy: RecipyForCalendar) => {
                amount = amount + recipy.amountPerPortion;
              }
            );
          }
          return amount;
        }
        default:
          return null;
      }
    } else return null;
  }

  onUpdateRecipy(event: RecipyForCalendar) {
    this.updateRecipy.emit({ recipy: event, mealtime: this.mealtime });
  }

  onRemoveRecipy(event: Recipy) {
    this.removeRecipy.emit({ recipy: event, mealtime: this.mealtime });
  }

  onSaveToShoppingList(event: ShoppingListItem) {
    this.saveToShoppingList.emit({ item: event, mealtime: this.mealtime });
  }

  get detailedRecipiesList() {
    if (this._day) {
      switch (this.mealtime) {
        case MealTime.Breakfast:
          return this._day.details.breakfastRecipies;
        case MealTime.Lunch:
          return this._day.details.lunchRecipies;
        case MealTime.Dinner:
          return this._day.details.dinnerRecipies;
      }
    } else return [];
  }

  get mealtimeText() {
    switch (this.mealtime) {
      case MealTime.Breakfast:
        return 'Сніданок';
      case MealTime.Lunch:
        return 'Обід';
      case MealTime.Dinner:
        return 'Вечеря';
    }
  }

  goScenario() {
    let id = this._day?.details.day + '_' + this.mealtime;
    this.router.navigate([id], { relativeTo: this.route });
  }
}
