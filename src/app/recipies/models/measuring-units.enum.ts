export enum MeasuringUnit {
  gr = 1,
  kg,
  l,
  ml,
  tableSpoon,
  dessertSpoon,
  teaSpoon,
  coffeeSpoon,
  pinch,
  bunch,
  item
}

export enum MeasuringUnitText {
  'гр' = 1,
  'кг',
  'л',
  'мл',
  'ст.л.',
  'дес.л.',
  'ч.л.',
  'коф.л.',
  'дрібка',
  'пучок',
  'шт.'
}

export const MeasuringUnitOptions = [
  MeasuringUnit.gr,
  MeasuringUnit.kg,
  MeasuringUnit.l,
  MeasuringUnit.ml,
  MeasuringUnit.tableSpoon,
  MeasuringUnit.dessertSpoon,
  MeasuringUnit.teaSpoon,
  MeasuringUnit.coffeeSpoon,
  MeasuringUnit.pinch,
  MeasuringUnit.bunch,
  MeasuringUnit.item
];

export const MeasuringUnitOptionsFluid = [
    MeasuringUnit.gr,
    MeasuringUnit.l,
    MeasuringUnit.ml,
    MeasuringUnit.tableSpoon,
    MeasuringUnit.dessertSpoon,
    MeasuringUnit.teaSpoon,
    MeasuringUnit.coffeeSpoon,
  ];

  export const MeasuringUnitOptionsSpice = [
    MeasuringUnit.gr,
    MeasuringUnit.teaSpoon,
    MeasuringUnit.coffeeSpoon,
    MeasuringUnit.pinch,
  ];

  export const MeasuringUnitOptionsHerbs = [
    MeasuringUnit.gr,
    MeasuringUnit.teaSpoon,
    MeasuringUnit.pinch,
    MeasuringUnit.bunch
  ];

  export const MeasuringUnitOptionsHardItems = [
    MeasuringUnit.gr,
    MeasuringUnit.kg,
    MeasuringUnit.item
  ];

