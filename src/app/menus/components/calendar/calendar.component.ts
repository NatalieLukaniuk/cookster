import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { MOCK_CALENDAR_DATA } from '../../services/mockData';
import { DayDetailsExtended, IDayDetails } from '../day/day.component';

import { DateService } from './../../services/date.service';

export interface Day {
  value: moment.Moment;
  active: boolean;
  selected: boolean;
  disabled: boolean;
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
  calendar: Week[] = [];
  userCalendarData: IDayDetails[] = [];
  destroyed$ = new Subject();
  userCalendarDataExtended: DayDetailsExtended[] = [];

  constructor(private dateService: DateService, private store: Store<IAppState>) {}
  ngOnDestroy(): void {
    this.destroyed$.next()
  }

  ngOnInit() {
    this.dateService.date.subscribe((res) => this.generate(res));
    this.userCalendarData = MOCK_CALENDAR_DATA; // TODO data should be fetched from user 
    this.store.pipe(select(getAllRecipies), takeUntil(this.destroyed$)).subscribe(res => {
      this.userCalendarData.forEach((item: IDayDetails) => {
        let itemToReturn: DayDetailsExtended = {
          day: item.day,
          breakfast: [],
          lunch: [],
          dinner: []
        }
        if(!!item.breakfast.length){
          item.breakfast.forEach(recId => {
            let foundRecipy = res.find(recipy => recipy.id == recId)
            if(foundRecipy){
              itemToReturn.breakfast.push(foundRecipy)
            }
          })
        }
        if(!!item.lunch.length){
          item.lunch.forEach(recId => {
            let foundRecipy = res.find(recipy => recipy.id == recId)
            if(foundRecipy){
              itemToReturn.lunch.push(foundRecipy)
            }
          })
        }
        if(!!item.dinner.length){
          item.dinner.forEach(recId => {
            let foundRecipy = res.find(recipy => recipy.id == recId)
            if(foundRecipy){
              itemToReturn.dinner.push(foundRecipy)
            }
          })
        }
        this.userCalendarDataExtended.push(itemToReturn)
      })
      console.log(this.userCalendarDataExtended)
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

          return {value, active, disabled, selected}
        })
      })
    }
    this.calendar = calendar;
  }
}
