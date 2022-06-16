import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { CalendarService } from '../../services/calendar.service';
import { Day } from '../calendar/calendar.component';

export interface IDayDetails {
  breakfast: string[], // array of recipy ids
  lunch: string[],
  dinner: string[],
  day: string // 2 digits of day, 2 digits of month, 4 digits of year
}

export class DayDetails implements IDayDetails {
  breakfast: string[] = [];
  lunch: string[] = [];
  dinner: string[] = [];
  constructor(public day: string) {
    this.day = day
  }
}

export interface DayDetailsExtended extends IDayDetails{
  breakfastRecipies: Recipy[], 
  lunchRecipies: Recipy[],
  dinnerRecipies: Recipy[],
  // day: string // 2 digits of day, 2 digits of month, 4 digits of year
}

export class EmptyDayDetailsExtended implements DayDetailsExtended {
  breakfastRecipies = [];
  lunchRecipies = [];
  dinnerRecipies = [];
  breakfast: string[] = [];
  lunch: string[] = [];
  dinner: string[] = [];
  constructor(public day: string) {
    this.day = day
  }
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

  removeRecipy(recipy: Recipy, mealtime: string){
    let detailsToSave: IDayDetails = {
      day: this.day.details.day,
      breakfast: this.day.details.breakfastRecipies.map(item => item.id),
      lunch: this.day.details.lunchRecipies.map(item => item.id),
      dinner: this.day.details.dinnerRecipies.map(item => item.id),
    }
    switch(mealtime){
      case 'breakfastRecipies': {
        detailsToSave.breakfast = detailsToSave.breakfast.filter(item => item != recipy.id)
      }
      break;
      case 'lunchRecipies': {
        detailsToSave.lunch = detailsToSave.lunch.filter(item => item != recipy.id)
      }
      break;
      case 'dinnerRecipies': {
        detailsToSave.dinner = detailsToSave.dinner.filter(item => item != recipy.id)
      }
      break;
    }
    this.updateDay.emit(detailsToSave)
  }

}
