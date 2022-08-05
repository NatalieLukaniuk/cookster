import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { DialogsService } from 'src/app/shared/services/dialogs.service';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { ShoppingListService } from 'src/app/shopping-list/services/shopping-list.service';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import {
  CalendarRecipyInDatabase,
  DayDetails,
  DayDetailsExtended,
  EmptyDayDetailsExtended,
  IDayDetails,
} from '../../models/calendar';
import { CalendarService } from '../../services/calendar.service';
import { DateService } from '../../services/date.service';
import { Day } from '../calendar/calendar.component';
import * as CalendarActions from './../../../store/actions/calendar.actions';

@Component({
  selector: 'app-calendar-by-month',
  templateUrl: './calendar-by-month.component.html',
  styleUrls: ['./calendar-by-month.component.scss'],
})
export class CalendarByMonthComponent implements OnInit, OnDestroy {
  @Input() isMobile: boolean = false;

  calendar: Day[] = [];
  userCalendarData: IDayDetails[] = [];
  destroyed$ = new Subject();

  currentUser: User | undefined;

  constructor(
    private dateService: DateService,
    private store: Store<IAppState>,
    private dialogsService: DialogsService,
    private calendarService: CalendarService,
    private shoppingListService: ShoppingListService
  ) {}

  drop(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
  ngOnInit() {
    this.dateService.date.subscribe((res) => {
      this.generateByMonth(res);
    });
    let currentUser$ = this.store.pipe(
      select(getCurrentUser),
      takeUntil(this.destroyed$)
    );
    let allRecipies$ = this.store.pipe(
      select(getAllRecipies),
      takeUntil(this.destroyed$)
    );
    combineLatest([currentUser$, allRecipies$]).subscribe((res) => {
      this.cleanCalendarRecipies();
      let [currentUser, recipies] = res;
      if (!!currentUser && 'details' in currentUser && !!currentUser.details) {
        this.currentUser = currentUser;
        this.userCalendarData = currentUser.details;
      }
      this.calendar = this.calendar.map((day: Day) => {
        let foundDay = this.userCalendarData.find(
          (item: IDayDetails) => item.day == day.details.day
        );
        if (!!foundDay) {
          let _day = _.cloneDeep(day);
          if ('breakfast' in foundDay && !!foundDay.breakfast.length) {
            foundDay.breakfast.forEach((rec: CalendarRecipyInDatabase) => {
              let foundRecipy = recipies.find(
                (recipy) => recipy.id == rec.recipyId
              );
              if (foundRecipy) {
                let recipy: RecipyForCalendar = {
                  ...foundRecipy,
                  portions: rec.portions,
                  amountPerPortion: rec.amountPerPortion,
                };
                _day.details.breakfastRecipies.push(recipy);
              }
            });
          }
          if ('lunch' in foundDay && !!foundDay.lunch.length) {
            foundDay.lunch.forEach((rec: CalendarRecipyInDatabase) => {
              let foundRecipy = recipies.find(
                (recipy) => recipy.id == rec.recipyId
              );
              if (foundRecipy) {
                let recipy: RecipyForCalendar = {
                  ...foundRecipy,
                  portions: rec.portions,
                  amountPerPortion: rec.amountPerPortion,
                };
                _day.details.lunchRecipies.push(recipy);
              }
            });
          }
          if ('dinner' in foundDay && !!foundDay.dinner.length) {
            foundDay.dinner.forEach((rec: CalendarRecipyInDatabase) => {
              let foundRecipy = recipies.find(
                (recipy) => recipy.id == rec.recipyId
              );
              if (foundRecipy) {
                let recipy: RecipyForCalendar = {
                  ...foundRecipy,
                  portions: rec.portions,
                  amountPerPortion: rec.amountPerPortion,
                };
                _day.details.dinnerRecipies.push(recipy);
              }
            });
          }
          return _day;
        } else return day;
      });
    });
  }

  generateByMonth(now: moment.Moment) {
    const startDay = now.clone().startOf('month');
    const endDay = now.clone().endOf('month');

    const date = startDay.clone().subtract(1, 'day');

    const calendar: Day[] = [];
    const currentDay = moment();
    while (date.isBefore(endDay, 'day')) {
      const value = date.add(1, 'day').clone();
      const active = moment().isSame(value, 'date');
      const disabled =
        !now.isSame(value, 'month') ||
        (!value.isSame(currentDay, 'date') && value.isBefore(currentDay));
      const selected = now.isSame(value, 'date');
      let det = new DayDetails(value.format('DDMMYYYY'));
      const details: DayDetailsExtended = {
        ...det,
        breakfastRecipies: [],
        lunchRecipies: [],
        dinnerRecipies: [],
      };
      calendar.push({ value, active, disabled, selected, details });
    }
    this.calendar = calendar;
  }

  cleanCalendarRecipies() {
    this.calendar = this.calendar.map((day) => {
      if (day.details) {
        let _day = _.cloneDeep(day);
        _day.details = new EmptyDayDetailsExtended(day.details.day);
        return _day;
      } else return day;
    });
  }

  onUpdateDay(event: IDayDetails) {
    if (!!this.currentUser) {
      this.calendarService.updateDay(this.currentUser, event);
    }
  }

  onSaveToShoppingList(event: ShoppingListItem) {
    if (this.currentUser) {
      this.shoppingListService.addList(this.currentUser, event);
    }
  }
  onAddRecipy(event: { day: Day; meal: string; recipyId: string }) {
    console.log(event);
    this.dialogsService
      .openPortionsDialog()
      .pipe(take(1))
      .subscribe((amount: { portions: number; amountPerPortion: number }) => {
        if (!!this.currentUser) {
          let userToSave: User = _.cloneDeep(this.currentUser);
          this.calendarService.saveRecipyToCalendar(
            userToSave,
            event.day.details.day,
            event.recipyId,
            event.meal,
            amount.portions,
            amount.amountPerPortion
          );
        }
      });
  }

  onDaySelected(event: {day: Day, meal: string}){
    this.store.dispatch(new CalendarActions.SetDaySelectedAction(event))
  }

  addAllToShoppingList(day: Day){
    console.log(day)
  }
}
