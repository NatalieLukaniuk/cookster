import { isNgTemplate } from '@angular/compiler';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { DayDetails, DayDetailsExtended, IDayDetails } from '../day/day.component';

import { DateService } from './../../services/date.service';

export interface Day {
  value: moment.Moment;
  active: boolean;
  selected: boolean;
  disabled: boolean;
  details: DayDetailsExtended
}

interface Week {
  days: Day[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isMobile: boolean = false;
  calendar: Week[] = [];
  userCalendarData: IDayDetails[] = [];
  destroyed$ = new Subject();

  constructor(private dateService: DateService, private store: Store<IAppState>) { }
  ngAfterViewInit(): void {
    this.scrollToCurrentDay()
  }
  ngOnDestroy(): void {
    this.destroyed$.next()
  }

  ngOnInit() {
    this.dateService.date.subscribe((res) => {
      this.generate(res)
    });
    let currentUser$ = this.store.pipe(select(getCurrentUser), takeUntil(this.destroyed$));
    let allRecipies$ = this.store.pipe(select(getAllRecipies), takeUntil(this.destroyed$));
    combineLatest([currentUser$, allRecipies$]).subscribe(res => {
      let [currentUser, recipies] = res;
      if (!!currentUser && 'details' in currentUser && !!currentUser.details) {
        this.userCalendarData = currentUser.details;
      }
      this.calendar.forEach((week: Week) => week.days.forEach((day: Day) => {
        let foundDay = this.userCalendarData.find((item: IDayDetails) => item.day == day.details.day);
        if (!!foundDay) {
          if ('breakfast' in foundDay && !!foundDay.breakfast.length) {
            foundDay.breakfast.forEach(recId => {
              let foundRecipy = recipies.find(recipy => recipy.id == recId)
              if (foundRecipy) {
                day.details.breakfastRecipies.push(foundRecipy)
              }
            })
          }
          if ('lunch' in foundDay && !!foundDay.lunch.length) {
            foundDay.lunch.forEach(recId => {
              let foundRecipy = recipies.find(recipy => recipy.id == recId)
              if (foundRecipy) {
                day.details.lunchRecipies.push(foundRecipy)
              }
            })
          }
          if ('dinner' in foundDay && !!foundDay.dinner.length) {
            foundDay.dinner.forEach(recId => {
              let foundRecipy = recipies.find(recipy => recipy.id == recId)
              if (foundRecipy) {
                day.details.dinnerRecipies.push(foundRecipy)
              }
            })
          }
        }
      }))
    })
  }

  findRecipy(allRecipies: Recipy[], recipyToFindId: string): Recipy | null {
    let recipy = allRecipies.find(rec => rec.id == recipyToFindId);
    if (recipy) {
      return recipy
    } else return null
  }

  scrollToCurrentDay() {
    let currentDay = new Date()
    let formatted = moment(currentDay).format('DDMMYYYY')
    let hacked = (+formatted - 1000000).toString()
    let el = document.getElementById(hacked);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end', inline: "nearest" });
    }

  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day');

    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone()
            const active = moment().isSame(value, 'date')
            const disabled = !now.isSame(value, 'month')
            const selected = now.isSame(value, 'date')
            let det = new DayDetails(value.format('DDMMYYYY'))
            const details: DayDetailsExtended = {
              ...det,
              breakfastRecipies: [],
              lunchRecipies: [],
              dinnerRecipies: []
            }
            return { value, active, disabled, selected, details }
          })
      })
    }
    this.calendar = calendar;
  }
}
