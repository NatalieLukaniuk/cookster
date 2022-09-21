import { AddListItemDialogComponent } from './../add-list-item-dialog/add-list-item-dialog.component';
import { PlannerService } from './../../services/planner.service';
import { getAllRecipies } from './../../../store/selectors/recipies.selectors';
import {
  MeasuringUnit,
  MeasuringUnitText,
} from 'src/app/recipies/models/measuring-units.enum';
import { getCalendar } from './../../../store/selectors/calendar.selectors';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, Observable, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Direction } from 'src/app/calendar/containers/calendar-container/calendar-container.component';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import {
  PlannerByDate,
  ShoppingList,
  ShoppingListItemReworked,
} from '../../models';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import {
  Recipy,
  RecipyForCalendar,
} from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import {
  getRecipyNameById,
  NormalizeDisplayedAmount,
} from 'src/app/recipies/services/recipies.utils';
import { MatDialog } from '@angular/material/dialog';
import { AddListDialogComponent } from '../add-list-dialog/add-list-dialog.component';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';

export interface SLItem {
  total: number;
  name: string;
  id: string;
  unit: MeasuringUnit;
  items: ShoppingListItem[];
}
@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
})
export class ShoppingComponent implements OnDestroy, OnInit {
  currentPlanner: PlannerByDate | undefined;
  destroyed$ = new Subject();
  Direction = Direction;
  currentUser$ = this.store.pipe(select(getCurrentUser));
  showCalendar = true;
  calendar: Day[] = [];
  planner$: Observable<PlannerByDate | null>;
  calendar$: Observable<Day[] | null>;

  fullIngredsList$ = new Subject<ShoppingListItem[]>();

  allRecipies: Recipy[] = [];

  itemsTree: SLItem[] | undefined;
  openedItem = -1;

  myLists: ShoppingList[] = [];

  constructor(
    private store: Store<IAppState>,
    private recipiesService: RecipiesService,
    public dialog: MatDialog,
    private plannerService: PlannerService
  ) {
    this.planner$ = this.store.pipe(select(getCurrentPlanner));
    this.calendar$ = this.store.pipe(select(getCalendar));

    this.fullIngredsList$.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res) {
        this.itemsTree = [];
        this.buildTree(res);
        console.log(this.itemsTree);
      }
    });
    this.store
      .pipe(select(getAllRecipies), takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res) {
          this.allRecipies = res;
        }
      });
  }
  ngOnInit(): void {
    combineLatest([this.planner$, this.calendar$])
      .pipe(
        takeUntil(this.destroyed$),
        map((res) => ({ planner: res[0], calendar: res[1] }))
      )
      .subscribe((res) => {
        if (res.planner) {
          this.currentPlanner = res.planner;
        }
        if (res.planner && res.planner.shoppingLists) {
          this.myLists = res.planner.shoppingLists.map((list) => {
            if (!list.items) {
              return {
                ...list,
                items: [],
              };
            } else {
              let newList = {
                ...list,
                items: list.items.map((item) => item),
              };
              newList.items.sort((a, b) => a.title!.localeCompare(b.title!));
              return newList;
            }
          });
        }
        if (res.planner && res.calendar) {
          let fullCal = res.calendar;
          const dayItemsToAdd = fullCal.filter(
            (detail: Day) =>
              +detail.details.day >= +this.currentPlanner!.startDate &&
              +detail.details.day <= +this.currentPlanner!.endDate
          );
          let list: ShoppingListItem[] = [];
          dayItemsToAdd.forEach((day: Day) => {
            if (day.details.breakfastRecipies.length) {
              let newList = this.processMealtime('breakfast', day);
              list = list.concat(newList);
            }
            if (day.details.lunchRecipies.length) {
              let newList = this.processMealtime('lunch', day);
              list = list.concat(newList);
            }
            if (day.details.dinnerRecipies.length) {
              let newList = this.processMealtime('dinner', day);
              list = list.concat(newList);
            }
          });
          this.fullIngredsList$.next(list);
        }
      });
  }

  buildTree(allitems: ShoppingListItem[]) {
    this.itemsTree = [];
    allitems.forEach((item) => {
      if (
        this.itemsTree!.length &&
        this.itemsTree!.find((it) => it.id == item.product)
      ) {
        this.itemsTree = this.itemsTree!.map((it) => {
          if (it.id == item.product) {
            let updated = { ...it };
            updated.total = it.total + item.amount;
            updated.items.push(item);
            return updated;
          } else return it;
        });
      } else if (this.itemsTree) {
        this.itemsTree.push({
          id: item.product,
          total: item.amount,
          unit: this.recipiesService.getDefaultMU(item.product),
          name: this.recipiesService.getProductNameById(item.product),
          items: [item],
        });
      }
    });
    this.itemsTree.sort((a, b) => a.name!.localeCompare(b.name!));
  }

  processMealtime(meal: string, day: Day): ShoppingListItem[] {
    let key: 'breakfastRecipies' | 'lunchRecipies' | 'dinnerRecipies' | null;
    let sublist: ShoppingListItem[] = [];
    switch (meal) {
      case 'breakfast':
        key = 'breakfastRecipies';
        break;
      case 'lunch':
        key = 'lunchRecipies';
        break;
      case 'dinner':
        key = 'dinnerRecipies';
        break;
      default:
        key = null;
    }
    if (key) {
      day.details[key].forEach((recipy: RecipyForCalendar) => {
        const coef = this.getCoef(recipy);
        recipy.ingrediends.forEach((ingr: Ingredient) => {
          let itemToPush: ShoppingListItem = {
            product: ingr.product,
            amount: ingr.amount * coef,
            defaultUnit: ingr.defaultUnit,
            recipyId: [recipy.id],
            day: [{ day: day.details.day, meal: meal }],
          };
          sublist.push(itemToPush);
        });
      });
    }
    return sublist;
  }

  getCoef(recipy: RecipyForCalendar): number {
    let totalAmount = 0;
    recipy.ingrediends.forEach((ingr) => {
      if (
        this.recipiesService.getIsIngredientIncludedInAmountCalculation(ingr)
      ) {
        totalAmount = totalAmount + ingr.amount;
      }
    });
    return (recipy.portions * recipy.amountPerPortion) / totalAmount;
  }

  getrecipyName(id: string) {
    if (this.allRecipies) {
      return getRecipyNameById(this.allRecipies, id);
    } else return '';
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
  getDisplayRange() {
    if (this.currentPlanner) {
      return {
        startDate: this.currentPlanner.startDate,
        endDate: this.currentPlanner.endDate,
      };
    } else return undefined;
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  onAddList() {
    const dialogRef = this.dialog.open(AddListDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (this.currentPlanner) {
        this.plannerService.addShoppingList(
          { name: result, items: [] },
          this.currentPlanner
        );
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (!event.previousContainer.id.includes('my-list')) {
      this.dropFromAllIngredsList(event);
    } else {
      this.dropBetweenMyLists(event);
    }
  }

  dropFromAllIngredsList(event: CdkDragDrop<SLItem[]>) {
    let split = event.item.element.nativeElement.id.split('/');
    let [id, amount, unit] = split;
    console.log(id, amount, unit);
    console.log(event.container.id);
    let ind = +event.container.id.split('-')[2];
    let convertedAmount = this.recipiesService.getAmountInSelectedUnit(
      +unit,
      id,
      +amount
    );
    let amnt = NormalizeDisplayedAmount(convertedAmount, +unit);
    let itemToAdd = {
      title: this.recipiesService.getProductNameById(id),
      amount: amnt + this.getUnitText(+unit),
    };
    this.myLists[ind].items?.length
      ? (this.myLists[ind].items = [...this.myLists[ind].items, itemToAdd])
      : (this.myLists[ind].items = [itemToAdd]);
    if (this.currentPlanner) {
      this.plannerService.updateShoppingLists(
        this.myLists,
        this.currentPlanner
      );
    }
  }

  dropBetweenMyLists(event: CdkDragDrop<ShoppingListItemReworked[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    if (this.currentPlanner) {
      this.plannerService.updateShoppingLists(
        this.myLists,
        this.currentPlanner
      );
    }
  }

  getHasBeenAdded(item: SLItem) {
    return !!this.myLists.find(
      (list) => !!list.items.find((ingr) => ingr.title == item.name)
    );
  }

  deleteList(list: ShoppingList) {
    if (this.currentPlanner) {
      this.plannerService.removeShoppingList(list, this.currentPlanner);
    }
  }

  deleteListItem(item: ShoppingListItemReworked, i: number) {
    this.myLists[i].items = this.myLists[i].items.filter(
      (el) => !(el.title == item.title)
    );
    if (this.currentPlanner) {
      this.plannerService.updateShoppingLists(
        this.myLists,
        this.currentPlanner
      );
    }
  }
  addItem(i: number) {
    const dialogRef = this.dialog.open(AddListItemDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (this.currentPlanner) {
        let [name, amount, comment] = result;
        this.myLists[i].items.push({
          title: name,
          amount: amount,
          comment: comment,
        });

        this.plannerService.updateShoppingLists(
          this.myLists,
          this.currentPlanner
        );
      }
    });
  }
}
