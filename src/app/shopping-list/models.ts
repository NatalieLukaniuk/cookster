import { MeasuringUnit } from 'src/app/recipies/models/measuring-units.enum';

export interface ShoppingListItem {
  recipyId?: string[]; // there can be either recipyId or listname
  listName?: string; // when ingredients are added directly in the shopping list, probably there will be predefined names
  day?: {day: string, meal: string}[]; // day is present when the ingredients are added from calendar; absent when added from recipy preview
  product: string;
  amount: number;
  defaultUnit: MeasuringUnit;
  productName?: string
}


export enum ShoppingListMode {
    All = 'Список',
    ListNameView = 'По групах',
    DayView = 'По днях'
}