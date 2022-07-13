import { Product } from 'src/app/recipies/models/products.interface';

import { Ingredient } from '../models/ingredient.interface';
import { MeasuringUnit } from '../models/measuring-units.enum';

export function grToKg(amount: number) {
  return amount / 1000;
}

export function kgToGR(amount: number) {
  return amount * 1000;
}

export function grToBunch(amount: number) {
  return amount / 40;
}

export function bunchToGr(amount: number) {
  return amount * 40;
}

export function grToPinch(amount: number, density: number) {
  const cofSp = grToCoffeeSpoons(amount, density);
  return cofSp * 23;
}

export function pinchToGr(amount: number, density: number) {
  const conSp = coffeeSpoonsToGr(amount, density) / 23;
  return conSp;
}

export function grToLiter(amount: number, density: number) {
  // density is in kg/m3
  return amount / density;
}

export function literToGr(amount: number, density: number) {
  // density is in kg/m3
  return amount * density;
}

export function literToMl(amount: number) {
  return amount * 1000;
}

export function mlToL(amount: number) {
  return amount / 1000;
}

export function grToMl(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml;
}

export function mlToGr(amount: number, density: number) {
  const l = mlToL(amount);
  const gr = literToGr(l, density);
  return gr;
}

export function grToTableSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 18;
}

export function tableSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 18;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToTeaSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 5;
}

export function teaSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 5;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToDessertSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 10;
}

export function dessertSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 10;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToCoffeeSpoons(amount: number, density: number) {
  // density is in kg/m3
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 2.5;
}

export function coffeeSpoonsToGr(amount: number, density: number) {
  // density is in kg/m3
  const ml = amount * 2.5;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function grToGlass(amount: number, density: number) {
  // density is in kg/m3, glass can fit 200ml
  const l = grToLiter(amount, density);
  const ml = literToMl(l);
  return ml / 200;
}

export function glassToGr(amount: number, density: number) {
  // density is in kg/m3, glass can fit 200ml
  const ml = amount * 200;
  const l = mlToL(ml);
  const gr = literToGr(l, density);
  return gr;
}

export function itemsToGr(amount: number, grInOneItem: number) {
  return amount * grInOneItem;
}

export function grToItems(amount: number, grInOneItem: number) {
  return amount / grInOneItem;
}

export function convertAmountToSelectedUnit(
  unit: MeasuringUnit,
  ingredient: Ingredient,
  allProducts: Product[]
) {
  if (unit == MeasuringUnit.gr) {
    return ingredient.amount;
  } else {
    let amount = 0;
    switch (unit) {
      case MeasuringUnit.kg:
        amount = grToKg(ingredient.amount);
        break;
      case MeasuringUnit.l:
        amount = grToLiter(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.ml:
        amount = grToMl(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.tableSpoon:
        amount = grToTableSpoons(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.dessertSpoon:
        amount = grToDessertSpoons(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.teaSpoon:
        amount = grToTeaSpoons(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.coffeeSpoon:
        amount = grToCoffeeSpoons(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.pinch:
        amount = grToPinch(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.bunch:
        amount = grToBunch(ingredient.amount);
        break;
      case MeasuringUnit.item:
        amount = grToItems(
          ingredient.amount,
          getGrPerItem(ingredient.product, allProducts)
        );
        break;
      case MeasuringUnit.cup:
        amount = grToGlass(
          ingredient.amount,
          getDensity(ingredient.product, allProducts)
        );
    }
    return amount;
  }
}

export function getDensity(productId: string, allProducts: Product[]) {
  let density = 0;
  for (let item of allProducts) {
    if (item.id === productId) {
      density = item.density;
    }
  }
  return density;
}

export function getGrPerItem(productId: string, allProducts: Product[]) {
  let grInOneItem = 0;
  for (let item of allProducts) {
    if (item.id === productId) {
      grInOneItem = item.grInOneItem ? item.grInOneItem : 0;
    }
  }
  return grInOneItem;
}

export function transformToGr(
  ingr: Ingredient,
  amount: number,
  unit: MeasuringUnit,
  allProducts: Product[]
): number {
  let density: number = getDensity(ingr.product, allProducts);
  let grInOneItem: number = getGrPerItem(ingr.product, allProducts);
  switch (unit) {
    case MeasuringUnit.gr:
      return amount;
    case MeasuringUnit.kg:
      return kgToGR(amount);
    case MeasuringUnit.bunch:
      return bunchToGr(amount);
    case MeasuringUnit.coffeeSpoon:
      return coffeeSpoonsToGr(amount, density);
    case MeasuringUnit.dessertSpoon:
      return dessertSpoonsToGr(amount, density);
    case MeasuringUnit.l:
      return literToGr(amount, density);
    case MeasuringUnit.ml:
      return mlToGr(amount, density);
    case MeasuringUnit.pinch:
      return pinchToGr(amount, density);
    case MeasuringUnit.tableSpoon:
      return tableSpoonsToGr(amount, density);
    case MeasuringUnit.teaSpoon:
      return teaSpoonsToGr(amount, density);
    case MeasuringUnit.item:
      return itemsToGr(amount, grInOneItem);
    case MeasuringUnit.cup:
      return glassToGr(amount, density);
      default: return 0
  }
}

export function getIngredientIdFromName(
  ingr: any,
  allProducts: Product[]
): string {
  let productId = '';
  for (let product of allProducts) {
    if (product.name === ingr.ingredient) {
      productId = product.id;
    }
  }
  return productId;
}

export function getIngredientText(
  ingr: Ingredient,
  allProducts: Product[]
): string {
  let productName = '';
  for (let product of allProducts) {
    if (product.id === ingr.product) {
      productName = product.name;
    }
  }
  return productName;
}

export function NormalizeDisplayedAmount(
  weirdAmount: number,
  unit: MeasuringUnit
): number {
  switch (unit) {
    case MeasuringUnit.bunch:
      return normalizeDecimal(weirdAmount, 1);
    case MeasuringUnit.coffeeSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.cup:
      return normalizeDecimal(weirdAmount, 1);
    case MeasuringUnit.dessertSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.gr:
      return roundToNoDecimals(weirdAmount);
    case MeasuringUnit.item:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.kg:
      return normalizeDecimal(weirdAmount, 2);
    case MeasuringUnit.l:
      return normalizeDecimal(weirdAmount, 2);
    case MeasuringUnit.ml:
      return roundToNoDecimals(weirdAmount);
    case MeasuringUnit.pinch:
      return roundToNoDecimals(weirdAmount);
    case MeasuringUnit.tableSpoon:
      return getNiceDecimal(weirdAmount);
    case MeasuringUnit.teaSpoon:
      return getNiceDecimal(weirdAmount);
      default: return 0
  }
}

export function roundToNoDecimals(amount: number): number {
  if (amount >= 1) {
    return Math.round(amount);
  } else return 1;
}

export function normalizeDecimal(amount: number, places: number): number {
  if ((amount * Math.pow(10, places)) % 0.5) {
    return Math.round(amount * Math.pow(10, places)) / Math.pow(10, places);
  } else return amount;
}

export function getNiceDecimal(amount: number): number {
  if ((amount * 10) % 10) {
    let remainder = (amount * 10) % 10;
    if (remainder > 0 && remainder < 3) {
      return Math.floor(amount) > 0? Math.floor(amount) : 0.5;
    } else if (remainder >= 3 && remainder < 7) {
      return Math.floor(amount) + 0.5;
    } else {
      return Math.ceil(amount);
    }
  } else return amount;
}
