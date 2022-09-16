import { take } from 'rxjs/operators';
import { getCurrentRoute } from './../../../store/selectors/ui.selectors';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/reducers';

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
export class PlannerByDateRangeComponent implements OnInit {
  Tabs = Tabs;

  tabs = [
    { link: 'planning', name: 'Планування' },
    { link: 'shopping', name: 'Список покупок' },
    { link: 'preps', name: 'Попереднє приготування' },
  ];
  activeLink = '';
  constructor(private router: Router, private store: Store<IAppState>) {
    this.store
      .pipe(select(getCurrentRoute), take(1))
      .subscribe((route) => (this.activeLink = route));
  }

  ngOnInit() {}
}
