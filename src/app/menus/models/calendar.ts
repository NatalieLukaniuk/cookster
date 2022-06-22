import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';

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
