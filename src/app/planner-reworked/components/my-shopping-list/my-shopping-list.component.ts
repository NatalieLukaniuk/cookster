import {
  PlannerByDate,
  ShoppingList,
  ShoppingListItemReworked,
} from './../../models';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddListDialogComponent } from '../add-list-dialog/add-list-dialog.component';
import * as _ from 'lodash';
import { PlannerService } from '../../services/planner.service';
import { AddListItemDialogComponent } from '../add-list-item-dialog/add-list-item-dialog.component';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { NormalizeDisplayedAmount } from 'src/app/recipies/services/recipies.utils';
import { SLItem } from '../shopping/shopping.component';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import {
  MeasuringUnit,
  MeasuringUnitText,
} from 'src/app/recipies/models/measuring-units.enum';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-my-shopping-list',
  templateUrl: './my-shopping-list.component.html',
  styleUrls: ['./my-shopping-list.component.scss'],
})
export class MyShoppingListComponent implements OnChanges, OnDestroy {
  @Input() planner!: PlannerByDate;
  myLists: ShoppingList[] = [];

  _currentPlanner: PlannerByDate | undefined;

  isMobile$: Observable<boolean>;
  destroy$ = new Subject();
  constructor(
    public dialog: MatDialog,
    private plannerService: PlannerService,
    private recipiesService: RecipiesService,
    private layoutService: LayoutService
  ) {
    this.isMobile$ = this.layoutService.isMobile$;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planner && changes.planner.currentValue) {
      this._currentPlanner = _.cloneDeep(this.planner);

      if (this.planner.shoppingLists) {
        this.myLists = _.cloneDeep(this.planner.shoppingLists);
        this.myLists = this.myLists.map((list) => {
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
    }
  }

  onAddList() {
    const dialogRef = this.dialog.open(AddListDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (this._currentPlanner) {
        this.plannerService.addShoppingList(
          { name: result, items: [], isExpanded: true },
          this._currentPlanner
        );
      }
    });
  }

  addItem(i: number) {
    const dialogRef = this.dialog.open(AddListItemDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (this._currentPlanner) {
        let [name, amount, comment] = result;
        this.myLists[i].items.push({
          title: name,
          amount: amount,
          comment: comment,
          editMode: false,
          completed: false,
        });

        this.plannerService.updateShoppingLists(
          this.myLists,
          this._currentPlanner
        );
      }
    });
  }

  deleteList(list: ShoppingList) {
    if (this._currentPlanner) {
      this.plannerService.removeShoppingList(list, this._currentPlanner);
    }
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
      editMode: false,
      completed: false,
    };
    this.myLists[ind].items?.length
      ? (this.myLists[ind].items = [...this.myLists[ind].items, itemToAdd])
      : (this.myLists[ind].items = [itemToAdd]);
    if (this._currentPlanner) {
      this.plannerService.updateShoppingLists(
        this.myLists,
        this._currentPlanner
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
    if (this._currentPlanner) {
      this.plannerService.updateShoppingLists(
        this.myLists,
        this._currentPlanner
      );
    }
  }

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }

  saveChanges(item: ShoppingListItemReworked, i: number) {
    if (this._currentPlanner) {
      this.myLists[i].items = this.myLists[i].items.map((el) => {
        if (el.title == item.title) {
          return {
            ...item,
            editMode: false,
          };
        } else return el;
      });
      this.plannerService.updateShoppingLists(
        this.myLists,
        this._currentPlanner
      );
    }
  }

  deleteListItem(item: ShoppingListItemReworked, i: number) {
    this.myLists[i].items = this.myLists[i].items.filter(
      (el) => !(el.title == item.title)
    );
    if (this._currentPlanner) {
      this.plannerService.updateShoppingLists(
        this.myLists,
        this._currentPlanner
      );
    }
  }

  hasNotCompletedItems(i: number) {
    return this.myLists[i].items.some((item) => !item.completed);
  }
  hasCompletedItems(i: number) {
    return this.myLists[i].items.some((item) => item.completed);
  }

  toggleCompleted(item: ShoppingListItemReworked, i: number) {
    this.myLists[i].items = this.myLists[i].items.map((el) => {
      if (el.title == item.title) {
        return {
          ...el,
          completed: !el.completed,
        };
      } else return el;
    });
    if (this._currentPlanner) {
      this.plannerService.updateShoppingLists(
        this.myLists,
        this._currentPlanner
      );
    }
  }

  toggleIsExpanded(i: number, value: boolean) {
    let _myLists = _.cloneDeep(this.myLists);
    _myLists[i].isExpanded = value;
    if (this._currentPlanner) {
      this.plannerService.updateShoppingLists(_myLists, this._currentPlanner);
    }
  }
}
