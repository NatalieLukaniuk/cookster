import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IAppState } from 'src/app/store/reducers';

import * as CalendarActions from '../../../store/actions/calendar.actions';

@Component({
  selector: 'app-calendar-container',
  templateUrl: './calendar-container.component.html',
  styleUrls: ['./calendar-container.component.scss'],
})
export class CalendarContainerComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  _isPlanner = false;
  @Input() isPlanner = false;
  @Input() isRecipySelected: boolean = false;
  destroy$ = new Subject();

  showDatePicker: boolean = false;

  datePickerRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
    this.route.data.subscribe((result) => (this._isPlanner = result.isPlanner));
    if (this.isPlanner) {
      this._isPlanner = true;
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onAddToCart() {
    if (this.datePickerRange.value.start && this.datePickerRange.value.end) {
      const startDate = this.transformDate(this.datePickerRange.value.start);
      const endDate = this.transformDate(this.datePickerRange.value.end);
      this.store.dispatch(
        new CalendarActions.SetAddToCartRangeSelected({
          startDate: startDate,
          endDate: endDate,
        })
      );
    }
  }

  getTwoDigitValue(value: string): string {
    if (value.length < 2) {
      return '0' + value;
    } else return value;
  }

  transformDate(date: Date): string {
    return (
      this.getTwoDigitValue(date.getDate().toString()) +
      this.getTwoDigitValue((date.getMonth() + 1).toString()) +
      date.getFullYear().toString()
    );
  }
}
