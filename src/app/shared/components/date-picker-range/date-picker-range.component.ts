import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss'],
})
export class DatePickerRangeComponent implements OnInit {
  datePickerRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  @Output() dateSelected = new EventEmitter<{
    startDate: string;
    endDate: string;
  }>();

  constructor() {}

  ngOnInit() {}
  
  onApply(){
    if (this.datePickerRange.value.start && this.datePickerRange.value.end) {
      const startDate = this.transformDate(this.datePickerRange.value.start);
      const endDate = this.transformDate(this.datePickerRange.value.end);
      this.dateSelected.emit({startDate, endDate})
    }
  }

  transformDate(date: Date): string {
    return (
      this.getTwoDigitValue(date.getDate().toString()) +
      this.getTwoDigitValue((date.getMonth() + 1).toString()) +
      date.getFullYear().toString()
    );
  }

  getTwoDigitValue(value: string): string {
    if (value.length < 2) {
      return '0' + value;
    } else return value;
  }
}
