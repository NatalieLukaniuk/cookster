import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { filter, takeUntil } from 'rxjs/operators';
import { getCurrentPlanner } from './../../../store/selectors/planners.selectors';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAppState } from 'src/app/store/reducers';
import { PlannerByDate } from '../../models';
import { Direction } from 'src/app/calendar/containers/calendar-container/calendar-container.component';
import { User } from 'src/app/auth/models/user.interface';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss'],
})
export class PlanningComponent implements OnInit, OnDestroy {
  currentPlanner: PlannerByDate | undefined;
  destroyed$ = new Subject();
  Direction = Direction;
  currentUser$ = this.store.pipe(select(getCurrentUser));

  constructor(private store: Store<IAppState>) {
    this.store
      .pipe(select(getCurrentPlanner), takeUntil(this.destroyed$))
      .subscribe((planner) => {
        if (planner) {
          this.currentPlanner = planner;
        }
      });
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

  ngOnInit() {}
}
