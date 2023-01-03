import { PlannerByDate, ShoppingList } from './../../models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { getUserPlanners } from './../../../store/selectors/user.selectors';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-active-shopping-list',
  templateUrl: './active-shopping-list.component.html',
  styleUrls: ['./active-shopping-list.component.scss'],
})
export class ActiveShoppingListComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  allPlanners: PlannerByDate[] = [];
  plannerWithActiveShoppingList: PlannerByDate | undefined;
  constructor(private store: Store<IAppState>) {
    this.store.pipe(select(getUserPlanners), takeUntil(this.destroy$)).subscribe(res => {
      if(res){
        let active = res.find(planner => planner.isShoppingListActive);
        if(active){
          this.plannerWithActiveShoppingList = active
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {}
}
