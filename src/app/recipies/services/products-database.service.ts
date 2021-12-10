import { Injectable } from '@angular/core';

import { MeasuringUnit } from '../models/measuring-units.enum';
import { Product, ProductType } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsDatabaseService {
  products: Product[] = [
    { id: 1, name: 'помідор', density: 600, grInOneItem: 150, calories: 24, defaultUnit: MeasuringUnit.gr, type: ProductType.hardItem }, // density is in kg/dm3
    { id: 2, name: 'картопля', density: 750, grInOneItem: 185, calories: 77, defaultUnit: MeasuringUnit.gr, type: ProductType.hardItem },
    { id: 3, name: 'оливкова олія', density: 914, calories: 898, defaultUnit: MeasuringUnit.tableSpoon, type: ProductType.fluid },
    { id: 4, name: 'сіль', density: 2165, calories: 0, defaultUnit: MeasuringUnit.pinch, type: ProductType.spice },
  ];
}
