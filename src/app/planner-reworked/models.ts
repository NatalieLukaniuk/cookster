import { SuggestionList } from 'src/app/planner/components/advance-preparation/advance-preparation.component';
export interface Planner {
    id: string,
    startDate: string,
    endDate: string,
    shoppingLists: ShoppingList[],
    preps: SuggestionList[]
}

export class PlannerByDate implements Planner {
    id: string;
    startDate: string;
    endDate: string;
    shoppingLists: ShoppingList[];
    preps: SuggestionList[];
    constructor(startDate: string, endDate: string){
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = startDate + '_' + endDate;
        this.shoppingLists = [];
        this.preps = []
    }
}

export interface ShoppingList {
    name: string,
    items: ShoppingListItemReworked[]
}

export interface ShoppingListItemReworked {
    title: string,
    amount: string,
    comment?: string
}

