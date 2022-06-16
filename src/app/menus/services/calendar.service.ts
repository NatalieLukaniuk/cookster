import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/auth/models/user.interface';
import { Day } from '../components/calendar/calendar.component';
import { DayDetails } from '../components/day/day.component';
import * as UserActions from '../../store/actions/user.actions';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private store: Store) { }

    saveRecipyToCalendar(userToSave: User, day: string, recipyId: string, mealTime: string) {
        if (!('details' in userToSave)) {
            userToSave.details = []
        }
        let dayExists = userToSave.details?.find(item => item.day == day);
        if (!!dayExists) {
            userToSave.details = userToSave.details!.map(item => {
                if (item.day == day) {
                    switch (mealTime) {
                        case 'breakfast': {
                            if (!('breakfast' in item)) {
                                item.breakfast = []
                            }
                            item.breakfast.push(recipyId)
                        };
                            break;
                        case 'lunch': {
                            if (!('lunch' in item)) {
                                item.lunch = []
                            }
                            item.lunch.push(recipyId)
                        };
                            break;
                        case 'dinner': {
                            if (!('dinner' in item)) {
                                item.dinner = []
                            }
                            item.dinner.push(recipyId)
                        };
                    }
                }
                return item
            })
            this.store.dispatch(new UserActions.UpdateUserAction(userToSave))
        } else if (!!day) {
            let itemToSave: DayDetails = new DayDetails(day);
            switch (mealTime) {
                case 'breakfast': itemToSave.breakfast.push(recipyId);
                    break;
                case 'lunch': itemToSave.lunch.push(recipyId);
                    break;
                case 'dinner': itemToSave.dinner.push(recipyId);
            }
            userToSave.details!.push(itemToSave)
            this.store.dispatch(new UserActions.UpdateUserAction(userToSave))
        }
    }
}