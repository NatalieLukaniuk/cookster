import { DayDetails } from 'src/app/calendar/models/calendar';
import { ShoppingListItem } from 'src/app/shopping-list/models';

export interface User {
  email: string;
  uid: string;
  details?: DayDetails[];
  id?: string;
  shoppingLists?: ShoppingListItem[];
}
