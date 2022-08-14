import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IAppState } from '../store/reducers';
import * as CalendarSelectors from '../store/selectors/calendar.selectors';
import { Recipy } from './../recipies/models/recipy.interface';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss'],
})
export class PlannerComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  recipyToOpen: Recipy | undefined;
  amountPerPortion: number | undefined;
  portions: number | undefined;

  selectedTab = new FormControl(0);

  constructor(private store: Store<IAppState>) {
    this.store
      .pipe(
        select(CalendarSelectors.getPreviewRecipy),
        takeUntil(this.destroy$)
      )
      .subscribe((recipyForPreview) => {
        if (recipyForPreview) {
          this.recipyToOpen = recipyForPreview.recipy;
          this.amountPerPortion = recipyForPreview.amountPerPortion;
          this.portions = recipyForPreview.portions;
          this.selectedTab.setValue(1);
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit() {}
}
