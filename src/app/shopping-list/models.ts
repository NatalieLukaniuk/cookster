import { Ingredient } from '../recipies/models/ingredient.interface';

export interface ShoppingListItem {
  recipyId?: string;
  listName?: string;
  ingredients: Ingredient[];
}
