import { PlannerByDate } from './../../models';
import { take, filter, takeUntil } from 'rxjs/operators';
import { getCurrentRoute } from './../../../store/selectors/ui.selectors';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { Subject } from 'rxjs';

export enum Tabs {
  Planning,
  Shopping,
  Preps,
}
@Component({
  selector: 'app-planner-by-date-range',
  templateUrl: './planner-by-date-range.component.html',
  styleUrls: ['./planner-by-date-range.component.scss'],
})
export class PlannerByDateRangeComponent implements OnInit, OnDestroy {
  Tabs = Tabs;

  tabs = [
    { link: 'planning', name: 'Планування' },
    { link: 'shopping', name: 'Список покупок' },
    { link: 'preps', name: 'Попереднє приготування' },
  ];
  activeLink = '';
  currentPlanner: PlannerByDate | undefined;
  destroy$ = new Subject();
  constructor(private router: Router, private store: Store<IAppState>) {
    this.store
      .pipe(select(getCurrentRoute), take(1))
      .subscribe((route) => (this.activeLink = route));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    this.store
      .pipe(
        select(getCurrentPlanner),
        filter((res) => !!res),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        if (res) {
          this.currentPlanner = res;
        }
      });
  }
}
