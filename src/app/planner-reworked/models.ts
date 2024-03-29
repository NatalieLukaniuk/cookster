import { SuggestionList } from "./preps.models";

export interface Planner {
  id: string;
  startDate: string;
  endDate: string;
  shoppingLists: ShoppingList[];
  preps: SuggestionList[];
  isShoppingListActive: boolean;
}

export class PlannerByDate implements Planner {
  id: string;
  startDate: string;
  endDate: string;
  shoppingLists: ShoppingList[];
  preps: SuggestionList[];
  isShoppingListActive: boolean;
  constructor(startDate: string, endDate: string) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = startDate + '_' + endDate;
    this.shoppingLists = [];
    this.preps = [];
    this.isShoppingListActive = false;
  }
}

export interface ShoppingList {
  name: string;
  isExpanded: boolean;
  items: ShoppingListItemReworked[];
}

export interface ShoppingListItemReworked {
  title: string;
  amount: string;
  comment?: string;
  editMode: boolean;
  completed: boolean;
}
