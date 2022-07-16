import { Component } from '@angular/core';
import * as moment from 'moment';

import { DateService } from '../../../services/date.service';

@Component({
  selector: 'app-calendar-selector',
  templateUrl: './calendar-selector.component.html',
  styleUrls: ['./calendar-selector.component.scss'],
})
export class CalendarSelectorComponent {
  date!: moment.Moment;
  constructor(public dateService: DateService) {}

  go(val: number) {
    this.dateService.changeMonth(val);
  }
}
