import { MeasuringUnit } from './measuring-units.enum';

export interface Ingredient {
    product: number;
    amount: number; // gramm
    defaultUnit: MeasuringUnit
}