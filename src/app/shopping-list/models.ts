import { Ingredient } from '../recipies/models/ingredient.interface';

export interface ShoppingListItem {
  recipyId?: string; // there can be either recipyId or listname
  listName?: string; // when ingredients are added directly in the shopping list, probably there will be predefined names
  day?: string; // day is present when the ingredients are added from calendar; absent when added from recipy preview
  meal?: string;
  ingredients: Ingredient[];
}


export enum ShoppingListMode {
    All = 'Список',
    ListNameView = 'По групах',
    DayView = 'По днях'
}