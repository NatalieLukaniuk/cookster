import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());

changeMonth(direction: number){
  const value = this.date.value.add(direction, 'month');
  this.date.next(value);
}

}
