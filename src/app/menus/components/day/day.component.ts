import { Component, Input, OnInit } from '@angular/core';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { Day } from '../calendar/calendar.component';

export interface IDayDetails {
  breakfast: string[], // array of recipy ids
  lunch: string[],
  dinner: string[],
  day: string // 2 digits of day, 2 digits of month, 4 digits of year
}

export class DayDetails implements IDayDetails {
  breakfast = [];
  lunch = [];
  dinner = [];
  constructor(public day: string) {
    this.day = day
  }
}

export interface DayDetailsExtended {
  breakfast: Recipy[], 
  lunch: Recipy[],
  dinner: Recipy[],
  day: string // 2 digits of day, 2 digits of month, 4 digits of year
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  @Input() day!: Day
  @Input()
  userCalendarDataExtended!: DayDetailsExtended[];

  currentDayDetails: DayDetailsExtended | undefined

  constructor() { }

  ngOnInit(): void {
    let currentDay = this.day.value.format('DDMMYYYY');
    this.currentDayDetails = this.userCalendarDataExtended.find((item: DayDetailsExtended) => item.day == currentDay.toString())
    
  }

  check() {
    console.log(this.currentDayDetails)
  }

}
