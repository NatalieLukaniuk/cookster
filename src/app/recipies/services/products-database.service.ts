import { Injectable } from '@angular/core';

import { MeasuringUnit } from '../models/measuring-units.enum';

// export enum ProductEnum {
//   tomato = 1,
//   potato = 2,
//   oliveOil = 3,
//   salt = 4
// }

// export enum ProductText {
//   'помідори' = 1,
//   'картопля',
//   'оливкова олія',
//   'сіль'
// }

export interface Product {
  id: number;
  name: string;
  density: number; // kg/dm3
  grInOneItem?: number;
  calories: number; //kKal,
  defaultUnit: MeasuringUnit;
  type: ProductType
}

export enum ProductType {
  fluid = 1,
  spice,
  herb,
  hardItem,
}

@Injectable({
  providedIn: 'root',
})
export class ProductsDatabaseService {
  products: Product[] = [
    { id: 1, name: 'помідор', density: 600, grInOneItem: 150, calories: 24, defaultUnit: MeasuringUnit.gr, type: ProductType.hardItem }, // density is in kg/m3
    { id: 2, name: 'картопля', density: 750, grInOneItem: 185, calories: 77, defaultUnit: MeasuringUnit.gr, type: ProductType.hardItem },
    { id: 3, name: 'оливкова олія', density: 914, calories: 898, defaultUnit: MeasuringUnit.tableSpoon, type: ProductType.fluid },
    { id: 4, name: 'сіль', density: 2165, calories: 0, defaultUnit: MeasuringUnit.pinch, type: ProductType.spice },
    { id: 5, name: 'борошно', density: 650, calories: 364, defaultUnit: MeasuringUnit.gr, type: ProductType.spice },
    { id: 6, name: 'молоко', density: 1027, calories: 42.3, defaultUnit: MeasuringUnit.ml, type: ProductType.fluid },
    { id: 7, name: 'соняшникова олія', density: 927, calories: 884.1, defaultUnit: MeasuringUnit.ml, type: ProductType.fluid },
    { id: 8, name: 'яйця', density: 1030, calories: 155.1, grInOneItem: 60, defaultUnit: MeasuringUnit.item, type: ProductType.hardItem },
    { id: 9, name: 'цукор', density: 720, calories: 386.7, defaultUnit: MeasuringUnit.teaSpoon, type: ProductType.spice },
    { id: 10, name: 'розпушувач для тіста', density: 720, calories: 79, defaultUnit: MeasuringUnit.teaSpoon, type: ProductType.spice },
  ];
}
