import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { combineLatest, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { RecipyForCalendar } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { DialogsService } from 'src/app/shared/services/dialogs.service';
import { ShoppingListItem } from 'src/app/shopping-list/models';
import { ShoppingListService } from 'src/app/shopping-list/services/shopping-list.service';
import { IAppState } from 'src/app/store/reducers';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import * as UserActions from '../../../store/actions/user.actions';
import { Direction } from '../../containers/calendar-container/calendar-container.component';
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
import { IngredientsToListBottomsheetComponent } from '../ingredients-to-list-bottomsheet/ingredients-to-list-bottomsheet.component';
import * as CalendarActions from './../../../store/actions/calendar.actions';
import { getaddToCartDateRange } from './../../../store/selectors/calendar.selectors';

@Component({
  selector: 'app-calendar-by-month',
  templateUrl: './calendar-by-month.component.html',
  styleUrls: ['./calendar-by-month.component.scss'],
})
export class CalendarByMonthComponent implements OnInit, OnDestroy {
  @Input() isMobile: boolean = false;
  @Input() direction!: Direction;
  @Input() displayRange: { startDate: string; endDate: string } | undefined;

  calendar: Day[] = [];
  userCalendarData: IDayDetails[] = [];
  destroyed$ = new Subject();

  currentUser: User | undefined;
  Direction = Direction;

  constructor(
    private dateService: DateService,
    private store: Store<IAppState>,
    private dialogsService: DialogsService,
    private calendarService: CalendarService,
    private shoppingListService: ShoppingListService,
    private recipiesService: RecipiesService,
    private _bottomSheet: MatBottomSheet
  ) {}

  drop(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
  ngOnInit() {
    let month$ = this.dateService.date;
    let currentUser$ = this.store.pipe(
      select(getCurrentUser),
      takeUntil(this.destroyed$)
    );
    let allRecipies$ = this.store.pipe(
      select(getAllRecipies),
      takeUntil(this.destroyed$)
    );
    combineLatest([currentUser$, allRecipies$, month$]).subscribe((res) => {
      this.generateByMonth(res[2]);
      if (res[0] && res[1]) {
        this.cleanCalendarRecipies();
        let [currentUser, recipies] = res;
        if (
          !!currentUser &&
          'details' in currentUser &&
          !!currentUser.details
        ) {
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
        if (!!this.currentUser?.prepLists) {
          this.calendar = this.calendar.map((day: Day) => {
            let foundDay = this.currentUser?.prepLists?.find(
              (list) => list.date == day.details.day
            );
            if (foundDay) {
              return {
                ...day,
                preps: foundDay,
              };
            } else return day;
          });
        }

        this.store.dispatch(
          new CalendarActions.LoadCalendarAction(this.calendar)
        );
      }
    });
    this.store
      .pipe(select(getaddToCartDateRange), takeUntil(this.destroyed$))
      .subscribe((date) => {
        if (date) {
          const dayItemsToAdd = this.calendar.filter(
            (detail: Day) =>
              +detail.details.day >= +date.startDate &&
              +detail.details.day <= +date.endDate
          );
          let list: ShoppingListItem[] = [];
          dayItemsToAdd.forEach((day: Day) => {
            if (day.details.breakfastRecipies.length) {
              let newList = this.processMealtime('breakfast', day);
              list = list.concat(newList);
            }
            if (day.details.lunchRecipies.length) {
              let newList = this.processMealtime('lunch', day);
              list = list.concat(newList);
            }
            if (day.details.dinnerRecipies.length) {
              let newList = this.processMealtime('dinner', day);
              list = list.concat(newList);
            }
          });
          const bottomSheetRef = this._bottomSheet.open(
            IngredientsToListBottomsheetComponent,
            {
              data: {
                shoppingItemsList: list,
                isMobile: this.isMobile,
              },
            }
          );

          bottomSheetRef
            .afterDismissed()
            .pipe(take(1))
            .subscribe((res: ShoppingListItem[]) => {
              if (!!res && this.currentUser) {
                this.shoppingListService.addList(this.currentUser, res);
                this.store.dispatch(
                  new CalendarActions.AddToCartRangeResetAction()
                );
              }
            });
        }
      });
  }

  processMealtime(meal: string, day: Day): ShoppingListItem[] {
    let key: 'breakfastRecipies' | 'lunchRecipies' | 'dinnerRecipies' | null;
    let sublist: ShoppingListItem[] = [];
    switch (meal) {
      case 'breakfast':
        key = 'breakfastRecipies';
        break;
      case 'lunch':
        key = 'lunchRecipies';
        break;
      case 'dinner':
        key = 'dinnerRecipies';
        break;
      default:
        key = null;
    }
    if (key) {
      day.details[key].forEach((recipy: RecipyForCalendar) => {
        const coef = this.getCoef(recipy);
        recipy.ingrediends.forEach((ingr: Ingredient) => {
          let itemToPush: ShoppingListItem = {
            product: ingr.product,
            amount: ingr.amount * coef,
            defaultUnit: ingr.defaultUnit,
            recipyId: [recipy.id],
            day: [{ day: day.details.day, meal: meal }],
          };
          sublist.push(itemToPush);
        });
      });
    }
    return sublist;
  }

  getCoef(recipy: RecipyForCalendar): number {
    let totalAmount = 0;
    recipy.ingrediends.forEach((ingr) => {
      if (
        this.recipiesService.getIsIngredientIncludedInAmountCalculation(ingr)
      ) {
        totalAmount = totalAmount + ingr.amount;
      }
    });
    return (recipy.portions * recipy.amountPerPortion) / totalAmount;
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

  onSaveToShoppingList(event: ShoppingListItem[]) {
    if (this.currentUser) {
      this.shoppingListService.addList(this.currentUser, event);
    }
  }
  onAddRecipy(event: { day: Day; meal: string; recipyId: string }) {
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
            event.meal.split('_')[0],
            amount.portions,
            amount.amountPerPortion
          );
        }
      });
  }

  onDaySelected(event: { day: Day; meal: string }) {
    this.store.dispatch(new CalendarActions.SetDaySelectedAction(event));
  }

  onRecipyWasMoved() {
    this.mapCalendar();
  }

  mapCalendar() {
    let updatedDetails: DayDetails[] = [];
    this.calendar.forEach((day: Day) => {
      let _day: DayDetails = {
        day: day.details.day,
        breakfast: day.details.breakfastRecipies.map(
          (item: RecipyForCalendar) => ({
            recipyId: item.id,
            portions: item.portions,
            amountPerPortion: item.amountPerPortion,
          })
        ),
        lunch: day.details.lunchRecipies.map((item: RecipyForCalendar) => ({
          recipyId: item.id,
          portions: item.portions,
          amountPerPortion: item.amountPerPortion,
        })),
        dinner: day.details.dinnerRecipies.map((item: RecipyForCalendar) => ({
          recipyId: item.id,
          portions: item.portions,
          amountPerPortion: item.amountPerPortion,
        })),
      };
      updatedDetails.push(_day);
    });
    if (this.currentUser) {
      let userToSave: User = _.cloneDeep(this.currentUser);
      let updatedUser = {
        ...userToSave,
        details: updatedDetails,
      };
      this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }
  }

  isWithinRange(day: Day): boolean {
    if (this.displayRange) {
      return (
        +day.details.day >= +this.displayRange.startDate &&
        +day.details.day <= +this.displayRange.endDate
      );
    } else return true;
  }
}
