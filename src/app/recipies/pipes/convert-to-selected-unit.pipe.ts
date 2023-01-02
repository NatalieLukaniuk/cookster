import { MeasuringUnit } from 'src/app/recipies/models/measuring-units.enum';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { Pipe, PipeTransform } from '@angular/core';
import { convertAmountToSelectedUnitRefactored } from '../services/recipies.utils';

@Pipe({
  name: 'convertToSelectedUnit'
})
export class ConvertToSelectedUnitPipe implements PipeTransform {

  constructor(private recipiesService: RecipiesService){

  }

  transform(amountInGr: number, ingredientId: string, selectedUnit: MeasuringUnit): any {
    return convertAmountToSelectedUnitRefactored(amountInGr,selectedUnit,ingredientId, this.recipiesService.products$.value);
  }

}
