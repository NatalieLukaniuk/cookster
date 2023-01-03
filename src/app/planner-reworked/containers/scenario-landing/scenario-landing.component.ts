import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CalendarMode } from 'src/app/calendar/components/calendar-by-month/calendar-by-month.component';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { Direction } from 'src/app/calendar/containers/calendar-container/calendar-container.component';
import { IAppState } from 'src/app/store/reducers';
import { getCalendar } from 'src/app/store/selectors/calendar.selectors';
import { getCurrentPlanner } from 'src/app/store/selectors/planners.selectors';
import { PlannerByDate } from '../../models';

@Component({
  selector: 'app-scenario-landing',
  templateUrl: './scenario-landing.component.html',
  styleUrls: ['./scenario-landing.component.scss'],
})
export class ScenarioLandingComponent implements OnInit, OnDestroy {
  showCalendar = true;
  currentPlanner: PlannerByDate | undefined;

  planner$: Observable<PlannerByDate | null>;
  calendar$: Observable<Day[] | null>;
  destroyed$ = new Subject();

  Direction = Direction;
  CalendarMode = CalendarMode;
  constructor(private store: Store<IAppState>) {
    this.planner$ = this.store.pipe(select(getCurrentPlanner));
    this.calendar$ = this.store.pipe(select(getCalendar));
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {
    combineLatest([this.planner$, this.calendar$])
      .pipe(
        takeUntil(this.destroyed$),
        map((res) => ({ planner: res[0], calendar: res[1] }))
      )
      .subscribe((res) => {
        if (res.planner) {
          this.currentPlanner = res.planner;
        }
      });
  }
}
