import { Router } from '@angular/router';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { DayDetails } from './../../models/calendar';
import { getCurrentUser } from './../../../store/selectors/user.selectors';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Day } from '../../components/calendar/calendar.component';

@Component({
  selector: 'app-calendar-by-day',
  templateUrl: './calendar-by-day.component.html',
  styleUrls: ['./calendar-by-day.component.scss'],
})
export class CalendarByDayComponent implements OnInit {
  currentDay: moment.Moment | undefined;
  _day: Day | undefined;

  dayChanged$ = new Subject();

  constructor(
    private store: Store,
    private calendarService: CalendarService,
    private router: Router
  ) {
    this.dayChanged$.subscribe(() => this.getDayDetails());
  }

  ngOnInit(): void {
    this.currentDay = moment().clone();
    this.dayChanged$.next();
  }

  goPreviousDay() {
    this.currentDay!.subtract(1, 'day');
    this.dayChanged$.next();
  }
  goNextDay() {
    this.currentDay?.add(1, 'day');
    this.dayChanged$.next();
  }

  getDayDetails() {
    if (this.currentDay) {
      this.store.pipe(select(getCurrentUser)).subscribe((user) => {
        let stringDay = this.currentDay!.clone().format('DDMMYYYY');
        if (user) {
          let details = user.details?.find(
            (day: DayDetails) => day.day == stringDay
          );
          if (details) {
            let newDayDetails = new DayDetails(
              this.currentDay!.format('DDMMYYYY')
            );
            let dayTemplate: Day = {
              value: this.currentDay!,
              active: true,
              selected: false,
              disabled: false,
              details: {
                ...newDayDetails,
                breakfastRecipies: [],
                lunchRecipies: [],
                dinnerRecipies: [],
              },
            };
            this.calendarService
              .getRecipiesAndBuildDay(details, dayTemplate)
              .subscribe((res) => {
                if (res) {
                  this._day = res;
                }
              });
          } else {
            this._day = {
              value: this.currentDay!,
              active: true,
              selected: false,
              disabled: false,
              details: {
                breakfastRecipies: [],
                lunchRecipies: [],
                dinnerRecipies: [],
                day: stringDay,
                breakfast: [],
                lunch: [],
                dinner: [],
              },
            };
          }
        }
      });
    }
  }

  goByMonth() {
    this.router.navigate(['/calendar']);
  }
}
