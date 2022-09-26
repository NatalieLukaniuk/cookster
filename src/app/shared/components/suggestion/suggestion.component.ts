import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Suggestion } from 'src/app/planner-reworked/preps.models';
import {
  MeasuringUnit,
  MeasuringUnitText,
} from 'src/app/recipies/models/measuring-units.enum';
import { NormalizeDisplayedAmount } from 'src/app/recipies/services/recipies.utils';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
})
export class SuggestionComponent implements OnInit {
  @Input() suggestion!: Suggestion;
  @Input() showDelete = false;
  @Input() enableTimePicker: boolean = false;
  @Output() removeItem = new EventEmitter<Suggestion>();
  @Output() itemChanged = new EventEmitter<Suggestion>();
  NormalizeDisplayedAmount = NormalizeDisplayedAmount;

  showTimePicker: boolean = false;
  constructor() {}

  ngOnInit() {}

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }
  delete() {
    this.removeItem.emit(this.suggestion);
  }

  changeTime() {
    this.showTimePicker = true;
  }

  onTimeChanged(event: string) {
    this.showTimePicker = false;
    this.itemChanged.next({ ...this.suggestion, time: event });
  }
}
