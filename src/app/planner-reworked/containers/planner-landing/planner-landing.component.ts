import { getCurrentRoute } from './../../../store/selectors/ui.selectors';
import { Planner, PlannerByDate } from './../../models';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-planner-landing',
  templateUrl: './planner-landing.component.html',
  styleUrls: ['./planner-landing.component.scss'],
})
export class PlannerLandingComponent implements OnInit {
  isListView$: Observable<boolean>;
  showDatePicker = false;
  plannersList: Planner[] = [];

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isListView$ = this.store.pipe(
      select(getCurrentRoute),
      map((route) => route === 'planner-reworked')
    );
  }

  ngOnInit() {}

  onAddNewPlanner() {
    this.showDatePicker = true;
  }

  onDateSelected(event: { startDate: string; endDate: string }) {
    console.log(event);
    this.showDatePicker = false;
    this.plannersList.push(new PlannerByDate(event.startDate, event.endDate));
    console.log(this.plannersList);
  }

  onPlannerClicked(id: string) {
    this.router.navigate(['by-date/', id], {
      relativeTo: this.route,
    });
  }
}
