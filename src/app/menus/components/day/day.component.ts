import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Recipy, RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { CalendarService } from '../../services/calendar.service';
import { Day } from '../calendar/calendar.component';

export interface IDayDetails {
  breakfast: CalendarRecipyInDatabase[],
  lunch: CalendarRecipyInDatabase[],
  dinner: CalendarRecipyInDatabase[],
  day: string // 2 digits of day, 2 digits of month, 4 digits of year
}

export class DayDetails implements IDayDetails {
  breakfast: CalendarRecipyInDatabase[] = [];
  lunch: CalendarRecipyInDatabase[] = [];
  dinner: CalendarRecipyInDatabase[] = [];
  constructor(public day: string) {
    this.day = day
  }
}

export interface DayDetailsExtended extends IDayDetails {
  breakfastRecipies: RecipyForCalendar[],
  lunchRecipies: RecipyForCalendar[],
  dinnerRecipies: RecipyForCalendar[],
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
    this.day = day
  }
}

export interface CalendarRecipyInDatabase {
  recipyId: string, portions: number
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  @Input() day!: Day

  @Input() isMobile: boolean = false;

  @Output() updateDay = new EventEmitter<IDayDetails>()

  constructor() { }

  ngOnInit(): void {
  }

  removeRecipy(recipy: Recipy, mealtime: string) {
    let detailsToSave: IDayDetails = {
      day: this.day.details.day,
      breakfast: this.day.details.breakfastRecipies.map(item => {
        let toSave: CalendarRecipyInDatabase = {
          recipyId: item.id,
          portions: item.portions
        }
        return toSave
      }),
      lunch: this.day.details.lunchRecipies.map(item => {
        let toSave: CalendarRecipyInDatabase = {
          recipyId: item.id,
          portions: item.portions
        }
        return toSave
      }),
      dinner: this.day.details.dinnerRecipies.map(item => {
        let toSave: CalendarRecipyInDatabase = {
          recipyId: item.id,
          portions: item.portions
        }
        return toSave
      }),
    }
    switch (mealtime) {
      case 'breakfastRecipies': {
        detailsToSave.breakfast = detailsToSave.breakfast.filter(item => item.recipyId != recipy.id)
      }
        break;
      case 'lunchRecipies': {
        detailsToSave.lunch = detailsToSave.lunch.filter(item => item.recipyId != recipy.id)
      }
        break;
      case 'dinnerRecipies': {
        detailsToSave.dinner = detailsToSave.dinner.filter(item => item.recipyId != recipy.id)
      }
        break;
    }
    this.updateDay.emit(detailsToSave)
  }

}
