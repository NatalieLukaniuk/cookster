import { ProductEnum } from "./product.enum";

export interface Product{
    id: ProductEnum,
    name: string,
    density: number, // kg/dm3
    grInOneItem?: number,
    calories: number //kKal
}