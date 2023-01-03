import { RecipiesService } from './../../../recipies/services/recipies.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Suggestion } from 'src/app/planner-reworked/preps.models';
import {
  MeasuringUnit,
  MeasuringUnitText,
} from 'src/app/recipies/models/measuring-units.enum';
import { NormalizeDisplayedAmount } from 'src/app/recipies/services/recipies.utils';
import * as _ from 'lodash';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
})
export class SuggestionComponent implements OnInit {
  @Input() suggestion!: Suggestion;
  @Input() showDelete = false;
  @Input() enableTimePicker: boolean = false;
  @Input() isAddMode: boolean = false;
  @Output() removeItem = new EventEmitter<Suggestion>();
  @Output() itemChanged = new EventEmitter<Suggestion>();
  NormalizeDisplayedAmount = NormalizeDisplayedAmount;

  showTimePicker: boolean = false;
  constructor(private recipiesService: RecipiesService) {}

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
  drop(event: CdkDragDrop<any>) {
    let ingr = {
      productId: event.item.data.ingredient.product,
      productName: this.recipiesService.getIngredientText(
        event.item.data.ingredient
      ),
      amount: this.recipiesService.getAmountInSelectedUnit(
        event.item.data.ingredient.defaultUnit,
        event.item.data.ingredient.product,        
        event.item.data.ingredient.amount * event.item.data.coef
      ),
      unit: event.item.data.ingredient.defaultUnit,
    };
    let updated = _.cloneDeep(this.suggestion);
    updated.ingredients.push(ingr);

    debugger;
    this.itemChanged.next(updated);
  }
}
