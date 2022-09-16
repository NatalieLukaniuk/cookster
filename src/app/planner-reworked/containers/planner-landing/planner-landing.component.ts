import { SetCurrentPlannerByDateAction } from './../../../store/actions/planner.actions';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { PlannerService } from './../../services/planner.service';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { getCurrentRoute } from './../../../store/selectors/ui.selectors';
import { Planner, PlannerByDate } from './../../models';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-planner-landing',
  templateUrl: './planner-landing.component.html',
  styleUrls: ['./planner-landing.component.scss'],
})
export class PlannerLandingComponent implements OnInit, OnDestroy {
  isListView$: Observable<boolean>;
  showDatePicker = false;
  plannersList: Planner[] = [];
  destroyed$ = new Subject();
  isMobile$: Observable<boolean>;

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute,
    private plannerService: PlannerService,
    private layoutService: LayoutService
  ) {
    this.isListView$ = this.store.pipe(
      select(getCurrentRoute),
      map((route) => route === 'planner-reworked')
    );
    this.store
      .pipe(select(getCurrentUser), takeUntil(this.destroyed$))
      .subscribe((user) => {
        if (user && user.planner) {
          this.plannersList = user.planner;
        }
      });
    this.isMobile$ = this.layoutService.isMobile$;
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {}

  onAddNewPlanner() {
    this.showDatePicker = true;
  }

  onDateSelected(event: { startDate: string; endDate: string }) {
    this.showDatePicker = false;
    this.plannerService.addPlannerByDate(
      new PlannerByDate(event.startDate, event.endDate)
    );
  }

  onPlannerClicked(id: string) {
    this.router.navigate(['by-date/', id, 'planning'], {
      relativeTo: this.route,
    });
  }
  deletePlanner(planner: PlannerByDate) {
    //todo: add warning and request for confirmation, this is permanent action
    this.plannerService.removePlannerByDate(planner);
  }
}
