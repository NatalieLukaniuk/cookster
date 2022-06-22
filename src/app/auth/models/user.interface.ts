import { DayDetails } from 'src/app/menus/components/day/day.component';

import { ShoppingListItem } from './../../menus/components/calendar-recipy/calendar-recipy.component';

export interface User {
    email: string
    uid: string
    details?: DayDetails[],
    id?: string,
    shoppingLists?: ShoppingListItem[]
}