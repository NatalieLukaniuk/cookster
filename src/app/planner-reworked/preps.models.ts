import * as moment from 'moment';
import { MeasuringUnit } from '../recipies/models/measuring-units.enum';

export interface Suggestion {
  ingredients: {
    productId: string;
    productName: string;
    amount: number;
    unit: MeasuringUnit;
  }[];
  prepDescription: string;
  recipyId: string;
  recipyTitle: string;
  day: moment.Moment;
  done?: boolean;
  time?: string;
}

export class SuggestionCard implements Suggestion {
  ingredients: {
    productId: string;
    productName: string;
    amount: number;
    unit: MeasuringUnit;
  }[];
  prepDescription: string;
  recipyId: string;
  recipyTitle: string;
  day: moment.Moment;
  done?: boolean = false;
  time?: string = '';
  constructor(suggestion: Suggestion) {
    this.ingredients = suggestion.ingredients;
    this.prepDescription = suggestion.prepDescription;
    this.recipyId = suggestion.recipyId;
    this.recipyTitle = suggestion.recipyTitle;
    this.day = suggestion.day;
    this.time = suggestion.time;
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
