import { MeasuringUnit } from './measuring-units.enum';

export interface Ingredient {
    product: string;
    amount: number; // gramm
    defaultUnit: MeasuringUnit
}