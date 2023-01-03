import { MeasuringUnit } from './measuring-units.enum';

export interface Product {
    id: string;
    name: string;
    density: number; // kg/dm3
    grInOneItem?: number;
    calories: number; //kKal,
    defaultUnit: MeasuringUnit;
    type: ProductType;
  }
  
  export enum ProductType {
    fluid = 1,
    spice,
    herb,
    hardItem,
    hardHomogenious,
    granular
  }
  
  export enum ProductTypeText {
    'рідкий продукт' = 1,
    'подрібнена спеція',
    'трава',
    'твердий продукт',
    'твердий однорідний',
    'сипучий продукт (крупа, борошно)'
  }
  
  export const ProductTypeOptions = [
    ProductType.fluid,
    ProductType.spice,
    ProductType.herb,
    ProductType.hardItem,
    ProductType.hardHomogenious,
    ProductType.granular
  ];


  


