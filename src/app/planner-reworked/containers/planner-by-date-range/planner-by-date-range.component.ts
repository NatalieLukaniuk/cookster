import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { PlannerByDate } from './../../models';
import { take, filter, takeUntil, map } from 'rxjs/operators';
import { getCurrentRoute } from './../../../store/selectors/ui.selectors';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { Subject, combineLatest } from 'rxjs';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import * as _ from 'lodash';
import { getFormattedName } from '../../services/planner.utils';

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

  getFormattedName = getFormattedName;
  constructor(
    private store: Store<IAppState>,
    private calendarService: CalendarService,
    private router: Router
  ) {
    this.store
      .pipe(select(getCurrentRoute), take(1))
      .subscribe((route) => (this.activeLink = route));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {
    let currentUser$ = this.store.pipe(select(getCurrentUser));
    let allRecipies$ = this.store.pipe(select(getAllRecipies));

    let currentPlanner$ = this.store.pipe(
      select(getCurrentPlanner),
      filter((res) => !!res)
    );

    combineLatest([currentUser$, allRecipies$, currentPlanner$])
      .pipe(
        takeUntil(this.destroy$),
        map((res) => ({ user: res[0], recipies: res[1], planner: res[2] }))
      )
      .subscribe((res) => {
        if (res.planner) {
          this.currentPlanner = res.planner;
        }
        if (res.planner && res.user && res.recipies) {
          let start =
            res.planner.startDate.substring(4) +
            res.planner.startDate.substring(2, 4) +
            res.planner.startDate.substring(0, 2);
          let end =
            res.planner.endDate.substring(4) +
            res.planner.endDate.substring(2, 4) +
            res.planner.endDate.substring(0, 2);
          if (res.user.details) {
            let userCalendarData = res.user.details;
            this.calendarService.buildCalendarInRange(
              start,
              end,
              userCalendarData,
              res.recipies
            );
          }
        }
      });
  }
  goAllPlanners() {
    this.router.navigate(['/planner-reworked']);
  }
}
