import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MeasuringUnit, MeasuringUnitText } from 'src/app/recipies/models/measuring-units.enum';
import { NormalizeDisplayedAmount } from 'src/app/recipies/services/recipies.utils';

import { Suggestion } from '../../../planner/components/advance-preparation/advance-preparation.component';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
})
export class SuggestionComponent implements OnInit {
  @Input() suggestion!: Suggestion;
  @Input() showDelete = false;
  @Output() removeItem = new EventEmitter<Suggestion>();
  NormalizeDisplayedAmount = NormalizeDisplayedAmount;
  constructor() {}

  ngOnInit() {}

  getUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit];
  }
  delete() {
    this.removeItem.emit(this.suggestion);
  }
}
