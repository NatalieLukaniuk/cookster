import { MeasuringUnit } from './measuring-units.enum';
import { ProductEnum } from './product.enum';

export interface Product {
  id: ProductEnum;
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
