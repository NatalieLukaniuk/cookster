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
  item,
  cup
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
  'шт.',
  'склянка'
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
  MeasuringUnit.item,
  MeasuringUnit.cup
];

export const MeasuringUnitOptionsFluid = [
    MeasuringUnit.gr,
    MeasuringUnit.l,
    MeasuringUnit.ml,
    MeasuringUnit.tableSpoon,
    MeasuringUnit.dessertSpoon,
    MeasuringUnit.teaSpoon,
    MeasuringUnit.coffeeSpoon,
    MeasuringUnit.cup
  ];

  export const MeasuringUnitOptionsSpice = [
    MeasuringUnit.gr,
    MeasuringUnit.teaSpoon,
    MeasuringUnit.tableSpoon,
    MeasuringUnit.coffeeSpoon,
    MeasuringUnit.pinch,
    MeasuringUnit.cup
  ];

  export const MeasuringUnitOptionsHerbs = [
    MeasuringUnit.gr,
    MeasuringUnit.teaSpoon,
    MeasuringUnit.pinch,
    MeasuringUnit.bunch,
    MeasuringUnit.cup
  ];

  export const MeasuringUnitOptionsHardItems = [
    MeasuringUnit.gr,
    MeasuringUnit.kg,
    MeasuringUnit.item
  ];

  export const MeasuringUnitOptionsGranular = [
    MeasuringUnit.gr,
    MeasuringUnit.kg,
    MeasuringUnit.dessertSpoon,
    MeasuringUnit.tableSpoon,
    MeasuringUnit.cup
  ]

  export const MeasuringUnitOptionsHardHomogeneous = [
    MeasuringUnit.gr,
    MeasuringUnit.kg
  ]
