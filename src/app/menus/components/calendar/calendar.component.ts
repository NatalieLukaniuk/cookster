import { isNgTemplate } from '@angular/compiler';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { MOCK_CALENDAR_DATA } from '../../services/mockData';
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
export class CalendarComponent implements OnInit, OnDestroy {
  @Input() isMobile: boolean = false;
  calendar: Week[] = [];
  userCalendarData: IDayDetails[] = [];
  destroyed$ = new Subject();

  constructor(private dateService: DateService, private store: Store<IAppState>) {}
  ngOnDestroy(): void {
    this.destroyed$.next()
  }

  ngOnInit() {
    this.dateService.date.subscribe((res) => this.generate(res));
    this.userCalendarData = MOCK_CALENDAR_DATA; // TODO data should be fetched from user 
    this.store.pipe(select(getAllRecipies), takeUntil(this.destroyed$)).subscribe(res => {
      this.calendar.forEach((week: Week) => week.days.forEach((day: Day) => {
        let foundDay = this.userCalendarData.find((item: IDayDetails) => item.day == day.details.day);
        if(!!foundDay){
          if(!!foundDay.breakfast.length){
            foundDay.breakfast.forEach(recId => {
              let foundRecipy = res.find(recipy => recipy.id == recId)
              if(foundRecipy){
                day.details.breakfast.push(foundRecipy)
              }
            })
          }
          if(!!foundDay.lunch.length){
            foundDay.lunch.forEach(recId => {
              let foundRecipy = res.find(recipy => recipy.id == recId)
              if(foundRecipy){
                day.details.lunch.push(foundRecipy)
              }
            })
          }
          if(!!foundDay.dinner.length){
            foundDay.dinner.forEach(recId => {
              let foundRecipy = res.find(recipy => recipy.id == recId)
              if(foundRecipy){
                day.details.dinner.push(foundRecipy)
              }
            })
          }
        }
      }))
    })

  }

  findRecipy(allRecipies: Recipy[], recipyToFindId: string): Recipy | null {
    let recipy =  allRecipies.find(rec => rec.id == recipyToFindId);
    if(recipy){
      return recipy
    } else return null
    
  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day');

    const calendar = [];

    while(date.isBefore(endDay, 'day')){
      calendar.push({
        days: Array(7)
        .fill(0)
        .map(() => {
          const value = date.add(1, 'day').clone()
          const active = moment().isSame(value, 'date')
          const disabled = !now.isSame(value, 'month')
          const selected = now.isSame(value, 'date')
          const details = new DayDetails(value.format('DDMMYYYY'))
          return {value, active, disabled, selected, details}
        })
      })
    }
    this.calendar = calendar;
  }
}
