import { MeasuringUnit } from './measuring-units.enum';

export interface Ingredient {
    product: string;
    amount: number; // gramm
    defaultUnit: MeasuringUnit;
    group?: IngredientsGroup
}

export enum IngredientsGroup {
    Main = 'main',
    Filling = 'filling',
    Souce = 'souce',
    Dough = 'dough',
    Decoration = 'decoration'
}

export const IngredientsGroupOptions = [
    IngredientsGroup.Main,
    IngredientsGroup.Filling,
    IngredientsGroup.Souce,
    IngredientsGroup.Dough,
    IngredientsGroup.Decoration
]

export function GetUkrIngredientsGroup(group: IngredientsGroup): string {
    let textToReturn = '';
    switch(group){
        case IngredientsGroup.Decoration: textToReturn = 'оздоблення';
        break;
        case IngredientsGroup.Main: textToReturn = 'основна страва';
        break;
        case IngredientsGroup.Dough: textToReturn = 'тісто';
        break;
        case IngredientsGroup.Souce: textToReturn = 'соус';
        break;
        case IngredientsGroup.Filling: textToReturn = 'начинка';
        break;
    }
    return textToReturn
}