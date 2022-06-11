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

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  @Input() day!: Day

  @Input() isMobile: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

  check() {
    console.log(this.day)
  }

}
