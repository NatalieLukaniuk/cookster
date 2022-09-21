import { UpdateUserAction } from './../../store/actions/user.actions';
import { take } from 'rxjs/operators';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { PlannerByDate, ShoppingList } from './../models';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class PlannerService {
  constructor(private store: Store) {}

  addPlannerByDate(planner: PlannerByDate) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user) {
        let updatedUser = _.cloneDeep(user);
        if (!updatedUser.planner) {
          updatedUser.planner = [];
        }
        updatedUser.planner.push(planner);
        this.store.dispatch(new UpdateUserAction(updatedUser));
      }
    });
  }

  updatePlannerByDate(planner: PlannerByDate) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user && user.planner) {
        let updatedUser = _.cloneDeep(user);
        updatedUser.planner = updatedUser.planner!.map((plannerByDate) => {
          if (plannerByDate.id == planner.id) {
            return planner;
          } else return plannerByDate;
        });
        this.store.dispatch(new UpdateUserAction(updatedUser));
      }
    });
  }

  removePlannerByDate(planner: PlannerByDate) {
    this.store.pipe(select(getCurrentUser), take(1)).subscribe((user) => {
      if (user && user.planner) {
        let updatedUser = _.cloneDeep(user);
        updatedUser.planner = updatedUser.planner!.filter(
          (plannerByDate) => plannerByDate.id !== planner.id
        );
        this.store.dispatch(new UpdateUserAction(updatedUser));
      }
    });
  }

  updateShoppingLists(lists: ShoppingList[], planner: PlannerByDate) {
    let updated = _.cloneDeep(planner);
    updated.shoppingLists = lists;
    this.updatePlannerByDate(updated);
  }

  removeShoppingList(list: ShoppingList, planner: PlannerByDate) {
    planner.shoppingLists = planner.shoppingLists.filter(
      (item) => item.name !== list.name
    );
    this.updatePlannerByDate(planner);
  }

  addShoppingList(list: ShoppingList, planner: PlannerByDate) {
    let updated = { ...planner };
    if (updated.shoppingLists) {
      updated.shoppingLists = [...updated.shoppingLists, list];
    } else {
      updated.shoppingLists = [list];
    }

    this.updatePlannerByDate(updated);
  }
}
