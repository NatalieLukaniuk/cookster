import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/auth/models/user.interface';

import * as UserActions from '../../store/actions/user.actions';
import { DayDetails, IDayDetails } from '../models/calendar';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private store: Store) {}

  saveRecipyToCalendar(
    userToSave: User,
    day: string,
    recipyId: string,
    mealTime: string,
    portions: number,
    amountPerPortion: number
  ) {
    if (!('details' in userToSave)) {
      userToSave.details = [];
    }
    let dayExists = userToSave.details?.find((item) => item.day == day);
    if (!!dayExists) {
      userToSave.details = userToSave.details!.map((item) => {
        if (item.day == day) {
          switch (mealTime) {
            case 'breakfast':
              {
                if (!('breakfast' in item)) {
                  item.breakfast = [];
                }
                item.breakfast.push({ recipyId, portions, amountPerPortion });
              }
              break;
            case 'lunch':
              {
                if (!('lunch' in item)) {
                  item.lunch = [];
                }
                item.lunch.push({ recipyId, portions, amountPerPortion });
              }
              break;
            case 'dinner': {
              if (!('dinner' in item)) {
                item.dinner = [];
              }
              item.dinner.push({ recipyId, portions, amountPerPortion });
            }
          }
        }
        return item;
      });
      this.store.dispatch(new UserActions.UpdateUserAction(userToSave));
    } else if (!!day) {
      let itemToSave: DayDetails = new DayDetails(day);
      switch (mealTime) {
        case 'breakfast':
          itemToSave.breakfast.push({ recipyId, portions, amountPerPortion });
          break;
        case 'lunch':
          itemToSave.lunch.push({ recipyId, portions, amountPerPortion });
          break;
        case 'dinner':
          itemToSave.dinner.push({ recipyId, portions, amountPerPortion });
      }
      userToSave.details!.push(itemToSave);
      this.store.dispatch(new UserActions.UpdateUserAction(userToSave));
    }
  }

  updateDay(userToSave: User, updatedDetails: IDayDetails) {
    let details;
    if (
      !updatedDetails.breakfast.length &&
      !updatedDetails.dinner.length &&
      !updatedDetails.lunch.length
    ) {
      details = userToSave.details?.filter(
        (item) => item.day !== updatedDetails.day
      );
    } else {
      details = userToSave.details?.map((item) => {
        if (item.day == updatedDetails.day) {
          return updatedDetails;
        } else return item;
      });
    }

    let updatedUser = {
      ...userToSave,
      details: details,
    };
    this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
  }
}
