import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Recipy, RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { ShoppingListItem } from 'src/app/shopping-list/models';

import { CalendarRecipyInDatabase, IDayDetails } from '../../models/calendar';
import { CalendarMode } from '../calendar-by-month/calendar-by-month.component';
import { Day } from '../calendar/calendar.component';
import { MealTime } from '../celandar-meal/celandar-meal.component';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit {
  @Input() day!: Day;

  @Input() isMobile: boolean = false;
  @Input()
  isPlanner!: boolean;
  @Input()
  isRecipySelected!: boolean;
  @Input() mode: CalendarMode = CalendarMode.Other

  @Output() updateDay = new EventEmitter<IDayDetails>();
  @Output() saveToShoppingList = new EventEmitter<ShoppingListItem[]>();
  @Output() daySelected = new EventEmitter<{ day: Day; meal: string }>();
  @Output() addRecipy = new EventEmitter<{
    day: Day;
    meal: string;
    recipyId: string;
  }>();

  selectedMeal: string = '';

  MealTime = MealTime;

  constructor() {}

  ngOnInit(): void {}

  removeRecipy(recipy: Recipy, mealtime: MealTime) {
    let updatedDay: Day = _.cloneDeep(this.day);
    switch(mealtime){
      case MealTime.Breakfast: updatedDay.details.breakfastRecipies = updatedDay.details.breakfastRecipies.filter(item => item.id !== recipy.id);
      break;
      case MealTime.Lunch: updatedDay.details.lunchRecipies = updatedDay.details.lunchRecipies.filter(item => item.id !== recipy.id);
      break;
      case MealTime.Dinner: updatedDay.details.dinnerRecipies = updatedDay.details.dinnerRecipies.filter(item => item.id !== recipy.id);
      break;
    }
    this.onUpdateDay(updatedDay);
  }

  updateRecipy(recipy: RecipyForCalendar, mealtime: string) {
    let detailsToSave: IDayDetails = {
      day: this.day.details.day,
      breakfast: this.day.details.breakfastRecipies.map(
        (item: RecipyForCalendar) => this.mapRecipies(item, recipy, mealtime)
      ),
      lunch: this.day.details.lunchRecipies.map((item: RecipyForCalendar) =>
        this.mapRecipies(item, recipy, mealtime)
      ),
      dinner: this.day.details.dinnerRecipies.map((item: RecipyForCalendar) =>
        this.mapRecipies(item, recipy, mealtime)
      ),
    };
    this.updateDay.emit(detailsToSave);
  }

  mapRecipies(
    originalItem: RecipyForCalendar,
    updatedItem: RecipyForCalendar,
    mealtime: string
  ): CalendarRecipyInDatabase {
    if (mealtime == mealtime && originalItem.id == updatedItem.id) {
      let toSave: CalendarRecipyInDatabase = {
        recipyId: originalItem.id,
        portions: updatedItem.portions,
        amountPerPortion: updatedItem.amountPerPortion,
      };
      return toSave;
    } else {
      let toSave: CalendarRecipyInDatabase = {
        recipyId: originalItem.id,
        portions: originalItem.portions,
        amountPerPortion: originalItem.amountPerPortion,
      };
      return toSave;
    }
  }

  onSaveToShoppingList(event: ShoppingListItem, meal: string) {
    event.day = [{ day: this.day.details.day, meal: meal }];
    this.saveToShoppingList.emit([event]);
  }

  onAddRecipy() {
    this.daySelected.emit({ day: this.day, meal: this.selectedMeal });
  }

  passAddRecipy(event: {
    day: Day;
    meal: string;
    recipyId: string;
  }){
    this.addRecipy.emit(event)
  }

  onUpdateDay(event: Day){
    let dayToSave: IDayDetails = {
      day: event.details.day,
      breakfast: event.details.breakfastRecipies.map(item => ({recipyId: item.id, portions: item.portions, amountPerPortion: item.amountPerPortion})),
      lunch: event.details.lunchRecipies.map(item => ({recipyId: item.id, portions: item.portions, amountPerPortion: item.amountPerPortion})),
      dinner: event.details.dinnerRecipies.map(item => ({recipyId: item.id, portions: item.portions, amountPerPortion: item.amountPerPortion}))
    }
    this.updateDay.emit(dayToSave)
  }
}
