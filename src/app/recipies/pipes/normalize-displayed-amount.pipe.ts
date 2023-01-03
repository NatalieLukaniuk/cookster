import { MeasuringUnit } from 'src/app/recipies/models/measuring-units.enum';
import { Pipe, PipeTransform } from '@angular/core';
import { NormalizeDisplayedAmount } from '../services/recipies.utils';

@Pipe({
  name: 'normalizeDisplayedAmount'
})
export class NormalizeDisplayedAmountPipe implements PipeTransform {

  transform(realAmount: number, unit: MeasuringUnit): any {
    return NormalizeDisplayedAmount(realAmount, unit);
  }

}
