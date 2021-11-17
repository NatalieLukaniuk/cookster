import { ProductEnum } from "./product.enum";

export interface Ingredient {
    product: ProductEnum;
    amount: number // gramm
}