import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Recipy, RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { DialogsService } from 'src/app/shared/services/dialogs.service';
import { ShoppingListItem } from 'src/app/shopping-list/models';
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
import { RecipiesBottomsheetComponent } from '../recipies-bottomsheet/recipies-bottomsheet.component';
import { ShoppingListService } from './../../../shopping-list/services/shopping-list.service';
import * as FiltersActions from './../../../store/actions/filters.actions';
import { DateService } from './../../services/date.service';

export interface Day {
  value: moment.Moment;
  active: boolean;
  selected: boolean;
  disabled: boolean;
  details: DayDetailsExtended;
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

  currentUser: User | undefined;

  constructor(
    private dateService: DateService,
    private store: Store<IAppState>,
    private _bottomSheet: MatBottomSheet,
    private dialogsService: DialogsService,
    private calendarService: CalendarService,
    private shoppingListService: ShoppingListService
  ) {}
  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit() {
    this.dateService.date.subscribe((res) => {
      this.generate(res);
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
      this.calendar.forEach((week: Week) =>
        week.days.forEach((day: Day) => {
          let foundDay = this.userCalendarData.find(
            (item: IDayDetails) => item.day == day.details.day
          );
          if (!!foundDay) {
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
                  day.details.breakfastRecipies.push(recipy);
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
                  day.details.lunchRecipies.push(recipy);
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
                  day.details.dinnerRecipies.push(recipy);
                }
              });
            }
          }
        })
      );
    });
  }

  cleanCalendarRecipies() {
    this.calendar.forEach((week: Week) =>
      week.days.forEach((day) => {
        if (day.details) {
          day.details = new EmptyDayDetailsExtended(day.details.day);
        }
      })
    );
  }

  findRecipy(allRecipies: Recipy[], recipyToFindId: string): Recipy | null {
    let recipy = allRecipies.find((rec) => rec.id == recipyToFindId);
    if (recipy) {
      return recipy;
    } else return null;
  }

  getCurrentDay(): string {
    let currentDay = new Date();
    return moment(currentDay).format('DDMMYYYY');
  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day');

    const calendar = [];

    const currentDay = moment();
    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
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
            return { value, active, disabled, selected, details };
          }),
      });
    }
    this.calendar = calendar;
  }

  addRecipy(day: Day) {
    const bottomSheetRef = this._bottomSheet.open(
      RecipiesBottomsheetComponent,
      { panelClass: 'recipies-bottomsheet' }
    );
    bottomSheetRef
      .afterDismissed()
      .pipe(take(1))
      .subscribe((recipyId: string) => {
        this.store.dispatch(new FiltersActions.ResetFiltersAction());
        if (!!recipyId) {
          this.dialogsService
            .openMealTimeSelectionDialog()
            .pipe(take(1))
            .subscribe(
              (res: {
                meal: string;
                portions: number;
                amountPerPortion: number;
              }) => {
                if (!!res.meal) {
                  this.store
                    .pipe(select(getCurrentUser), take(1))
                    .subscribe((user) => {
                      if (!!user) {
                        let userToSave: User = _.cloneDeep(user);
                        this.calendarService.saveRecipyToCalendar(
                          userToSave,
                          day.details.day,
                          recipyId,
                          res.meal,
                          res.portions,
                          res.amountPerPortion
                        );
                      }
                    });
                }
              }
            );
        }
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

  addAllToShoppingList(event: Day) {
    console.log(event);
  }
}
