import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipy, RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';

import { Day } from '../calendar/calendar.component';

export interface IDayDetails {
  breakfast: CalendarRecipyInDatabase[];
  lunch: CalendarRecipyInDatabase[];
  dinner: CalendarRecipyInDatabase[];
  day: string; // 2 digits of day, 2 digits of month, 4 digits of year
}

export class DayDetails implements IDayDetails {
  breakfast: CalendarRecipyInDatabase[] = [];
  lunch: CalendarRecipyInDatabase[] = [];
  dinner: CalendarRecipyInDatabase[] = [];
  constructor(public day: string) {
    this.day = day;
  }
}

export interface DayDetailsExtended extends IDayDetails {
  breakfastRecipies: RecipyForCalendar[];
  lunchRecipies: RecipyForCalendar[];
  dinnerRecipies: RecipyForCalendar[];
  // day: string // 2 digits of day, 2 digits of month, 4 digits of year
}

export class EmptyDayDetailsExtended implements DayDetailsExtended {
  breakfastRecipies = [];
  lunchRecipies = [];
  dinnerRecipies = [];
  breakfast: CalendarRecipyInDatabase[] = [];
  lunch: CalendarRecipyInDatabase[] = [];
  dinner: CalendarRecipyInDatabase[] = [];
  constructor(public day: string) {
    this.day = day;
  }
}

export interface CalendarRecipyInDatabase {
  recipyId: string;
  portions: number;
  amountPerPortion: number;
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit {
  @Input() day!: Day;

  @Input() isMobile: boolean = false;

  @Output() updateDay = new EventEmitter<IDayDetails>();

  constructor() {}

  ngOnInit(): void {}

  removeRecipy(recipy: Recipy, mealtime: string) {
    let detailsToSave: IDayDetails = {
      day: this.day.details.day,
      breakfast: this.day.details.breakfastRecipies.map((item) => {
        let toSave: CalendarRecipyInDatabase = {
          recipyId: item.id,
          portions: item.portions,
          amountPerPortion: item.amountPerPortion,
        };
        return toSave;
      }),
      lunch: this.day.details.lunchRecipies.map((item) => {
        let toSave: CalendarRecipyInDatabase = {
          recipyId: item.id,
          portions: item.portions,
          amountPerPortion: item.amountPerPortion,
        };
        return toSave;
      }),
      dinner: this.day.details.dinnerRecipies.map((item) => {
        let toSave: CalendarRecipyInDatabase = {
          recipyId: item.id,
          portions: item.portions,
          amountPerPortion: item.amountPerPortion,
        };
        return toSave;
      }),
    };
    switch (mealtime) {
      case 'breakfastRecipies':
        {
          detailsToSave.breakfast = detailsToSave.breakfast.filter(
            (item) => item.recipyId != recipy.id
          );
        }
        break;
      case 'lunchRecipies':
        {
          detailsToSave.lunch = detailsToSave.lunch.filter(
            (item) => item.recipyId != recipy.id
          );
        }
        break;
      case 'dinnerRecipies':
        {
          detailsToSave.dinner = detailsToSave.dinner.filter(
            (item) => item.recipyId != recipy.id
          );
        }
        break;
    }
    this.updateDay.emit(detailsToSave);
  }

  updateRecipy(recipy: RecipyForCalendar, mealtime: string){
    let detailsToSave: IDayDetails = {
      day: this.day.details.day,
      breakfast: this.day.details.breakfastRecipies.map((item: RecipyForCalendar) => this.mapRecipies(item, recipy, mealtime)),
      lunch: this.day.details.lunchRecipies.map((item: RecipyForCalendar) => this.mapRecipies(item, recipy, mealtime)),
      dinner: this.day.details.dinnerRecipies.map((item: RecipyForCalendar) => this.mapRecipies(item, recipy, mealtime)),
    };    
    this.updateDay.emit(detailsToSave);
  }

  mapRecipies(originalItem: RecipyForCalendar, updatedItem: RecipyForCalendar, mealtime: string): CalendarRecipyInDatabase{
    if(mealtime == mealtime && originalItem.id == updatedItem.id){
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

  getPortions(mealtime: string): number | null {
    if(this.day.details){
      switch(mealtime){
        case 'breakfast': return !!this.day.details.breakfastRecipies[0]? this.day.details.breakfastRecipies[0].portions : null;
        case 'lunch': return !!this.day.details.lunchRecipies[0]? this.day.details.lunchRecipies[0].portions: null;
        case 'dinner': return !!this.day.details.dinnerRecipies[0]? this.day.details.dinnerRecipies[0].portions: null;
        default: return null
      }
    } else return null
  }

  getAmountPerPerson(mealtime: string){
    if(this.day.details){
      switch(mealtime){
        case 'breakfast': {
          let amount = 0;
          if(!!this.day.details.breakfastRecipies.length){
            this.day.details.breakfastRecipies.forEach(recipy => {
              amount = amount + recipy.amountPerPortion
            })
          }
          return amount
        };
        case 'lunch': {
          let amount = 0;
          if(!!this.day.details.lunchRecipies.length){
            this.day.details.lunchRecipies.forEach(recipy => {
              amount = amount + recipy.amountPerPortion
            })
          }
          return amount
        };
        case 'dinner': {
          let amount = 0;
          if(!!this.day.details.dinnerRecipies.length){
            this.day.details.dinnerRecipies.forEach(recipy => {
              amount = amount + recipy.amountPerPortion
            })
          }
          return amount
        };
        default: return null
      }
    } else return null
  }
}
