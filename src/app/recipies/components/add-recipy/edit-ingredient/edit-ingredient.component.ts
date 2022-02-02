import { Component, Input, OnInit } from '@angular/core';
import { MeasuringUnitText } from 'src/app/recipies/models/measuring-units.enum';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

import { Ingredient } from './../../../models/ingredient.interface';

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrls: ['./edit-ingredient.component.scss']
})
export class EditIngredientComponent implements OnInit {
  @Input()
  ingredient!: Ingredient;

  constructor(private recipiesService: RecipiesService) { }

  ngOnInit() {
  }

  get ingredientText(): string {
    return this.recipiesService.getIngredientText(this.ingredient)
  }

  get amountToDisplay(){
    return this.recipiesService.convertAmountToSelectedUnit(this.ingredient.defaultUnit, this.ingredient);
  }

  get measuringUnitText(){
    return MeasuringUnitText[this.ingredient.defaultUnit]
  }

}
