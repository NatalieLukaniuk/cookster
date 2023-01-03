import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import * as CalendarActions from '../../../store/actions/calendar.actions';
import { DateService } from '../../services/date.service';
import * as moment from 'moment';

export enum Direction {
  Vertical,
  Horizontal,
}
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
  @Input() direction: Direction = Direction.Vertical;
  @Input() displayRange: { startDate: string; endDate: string } | undefined;
  @Input() displayMonthSelector: boolean = true;
  destroy$ = new Subject();

  showDatePicker: boolean = false;

  datePickerRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private store: Store<IAppState>,
    private dateService: DateService,
    private calendarService: CalendarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
    this.route.data.subscribe((result) => (this._isPlanner = result.isPlanner));
    if (this.isPlanner) {
      this._isPlanner = true;
    }

    let month$ = this.dateService.date;
    let currentUser$ = this.store.pipe(
      select(getCurrentUser),
      takeUntil(this.destroy$)
    );
    let allRecipies$ = this.store.pipe(
      select(getAllRecipies),
      takeUntil(this.destroy$)
    );
    combineLatest([currentUser$, allRecipies$, month$])
      .pipe(map((res) => ({ user: res[0], recipies: res[1], month: res[2] })))
      .subscribe((res) => {
        if (res.month && res.user && res.recipies) {
          let start = ''
          if(res.month.get('month') == moment().get('month')){
            start = res.month.format('YYYYMMDD');
          } else {
            start = res.month.clone().startOf('month').format('YYYYMMDD')
          }
          
          let end = res.month.clone().endOf('month').format('YYYYMMDD');
          if (res.user.details) {
            this.calendarService.buildCalendarInRange(
              start,
              end,
              res.user.details,
              res.recipies
            );
          }
        }
      });
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

  goByDay(){
    this.router.navigate(['calendar-by-day'])
  }
}
