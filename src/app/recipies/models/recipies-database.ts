import { MeasuringUnit } from './measuring-units.enum';

export const recipies = {
  '-MqeG-zaDtXXXm9SEK-3': {
    id: '1',
    name: 'Тушковане філе курки з картоплею, часником і майонезом на сковороді',
    ingrediends: [
      { product: 1, amount: 100, defaultUnit: MeasuringUnit.tableSpoon },
      { product: 2, amount: 1000, defaultUnit: MeasuringUnit.tableSpoon },
      { product: 4, amount: 10, defaultUnit: MeasuringUnit.tableSpoon },
    ],
    complexity: 1,
    steps: [
      {
        id: 1,
        description:
          'Філе нарізаємо на невеликі довгасті шматочки, посипаємо спеціями. Добре перемішавши, підливаємо до курятині рослинне масло і знову добре перемішуємо. Даємо промаринуватися при кімнатній температурі, протягом півгодини.',
        timeActive: 15,
        timePassive: 30,
      },
      {
        id: 2,
        description:
          'Викладаємо курятину в розпечене на сковороді олію. Обсмаживши до зміни в кольорі (м’ясо повинно побіліти), додаємо півкільця цибулі, дрібненько порубаний часник і продовжуємо готувати.',
        timeActive: 15,
        timePassive: 0,
      },
      {
        id: 3,
        description:
          'Обсмаживши півтори хвилини, викладаємо тонкі брусочки картоплі. Кладемо майонез, злегка солимо, посипаємо сушеним кропом. Підливаємо 250 мл прохолодної води і, встановивши мінімальний нагрів, тушкуємо приблизно 35 хвилин, орієнтуючись по готовності картоплі.',
        timeActive: 15,
        timePassive: 30,
      },
    ],
    type: [1, 5],
    photo: '/assets/images/recipies/1.jpg',
  },
  '-MqeG-zaDtXXer9SEK-3': {
    id: '2',
    name: 'Запечена в духовці картопля в мундирі',
    ingrediends: [
      { product: 2, amount: 1850, defaultUnit: MeasuringUnit.tableSpoon },
      { product: 3, amount: 18, defaultUnit: MeasuringUnit.gr },
      { product: 4, amount: 3, defaultUnit: MeasuringUnit.gr },
    ],
    complexity: 2,
    steps: [
      {
        id: 1,
        description:
          'Нечищену картоплю ретельно відмивають жорсткою губкою і проколюють виделкою в 2-3 місцях.',
        timeActive: 25,
        timePassive: 0,
      },
      {
        id: 2,
        description: 'Олію, сіль і спеції змішують',
        timeActive: 5,
        timePassive: 0,
      },
      {
        id: 3,
        description:
          'Картоплю поливають олією з спеціями і залишають на 20 хвилин. Духовку розігрівають до 200°С.',
        timeActive: 5,
        timePassive: 20,
      },
      {
        id: 4,
        description:
          'Картоплю викладають на деко і запікають приблизно 35 хвилин (орієнтуються на появу рум’яної скоринки).',
        timeActive: 5,
        timePassive: 35,
      },
      {
        id: 5,
        description:
          'Нечищену картоплю ретельно відмивають жорсткою губкою і проколюють виделкою в 2-3 місцях.',
        timeActive: 25,
        timePassive: 0,
      },
      {
        id: 6,
        description: 'Олію, сіль і спеції змішують',
        timeActive: 5,
        timePassive: 0,
      },
      {
        id: 7,
        description:
          'Картоплю поливають олією з спеціями і залишають на 20 хвилин. Духовку розігрівають до 200°С.',
        timeActive: 5,
        timePassive: 20,
      },
      {
        id: 8,
        description:
          'Картоплю викладають на деко і запікають приблизно 35 хвилин (орієнтуються на появу рум’яної скоринки).',
        timeActive: 5,
        timePassive: 35,
      },
    ],
    type: [1, 3, 12, 2, 4, 5, 6, 7, 8, 9, 10, 11],
    photo: '/assets/images/recipies/2.jpg',
  },
  '-MqeG-zaDdfver9SEK-3': {
    id: '3',
    name: 'куряче філе у фользі',
    ingrediends: [
      { product: 1, amount: 100, defaultUnit: MeasuringUnit.gr },
      { product: 2, amount: 1000, defaultUnit: MeasuringUnit.gr },
      { product: 4, amount: 10, defaultUnit: MeasuringUnit.gr },
    ],
    complexity: 3,
    steps: [
      {
        id: 1,
        description:
          'Філе нарізаємо на невеликі довгасті шматочки, посипаємо спеціями. Добре перемішавши, підливаємо до курятині рослинне масло і знову добре перемішуємо. Даємо промаринуватися при кімнатній температурі, протягом півгодини.',
        timeActive: 15,
        timePassive: 30,
      },
      {
        id: 2,
        description:
          'Викладаємо курятину в розпечене на сковороді олію. Обсмаживши до зміни в кольорі (м’ясо повинно побіліти), додаємо півкільця цибулі, дрібненько порубаний часник і продовжуємо готувати.',
        timeActive: 15,
        timePassive: 0,
      },
      {
        id: 3,
        description:
          'Обсмаживши півтори хвилини, викладаємо тонкі брусочки картоплі. Кладемо майонез, злегка солимо, посипаємо сушеним кропом. Підливаємо 250 мл прохолодної води і, встановивши мінімальний нагрів, тушкуємо приблизно 35 хвилин, орієнтуючись по готовності картоплі.',
        timeActive: 15,
        timePassive: 30,
      },
    ],
    type: [1, 5, 2, 6, 8],
    photo: '/assets/images/recipies/3.jpg',
  },
  '-MqeG-zaDdadff9SEK-3': {
    id: '4',
    name: 'Пікантна закуска з кабачків',
    ingrediends: [
      { product: 1, amount: 100, defaultUnit: MeasuringUnit.gr },
      { product: 2, amount: 1000, defaultUnit: MeasuringUnit.gr },
      { product: 4, amount: 10, defaultUnit: MeasuringUnit.gr },
    ],
    complexity: 1,
    steps: [
      {
        id: 1,
        description:
          'Філе нарізаємо на невеликі довгасті шматочки, посипаємо спеціями. Добре перемішавши, підливаємо до курятині рослинне масло і знову добре перемішуємо. Даємо промаринуватися при кімнатній температурі, протягом півгодини.',
        timeActive: 15,
        timePassive: 30,
      },
      {
        id: 2,
        description:
          'Викладаємо курятину в розпечене на сковороді олію. Обсмаживши до зміни в кольорі (м’ясо повинно побіліти), додаємо півкільця цибулі, дрібненько порубаний часник і продовжуємо готувати.',
        timeActive: 15,
        timePassive: 0,
      },
      {
        id: 3,
        description:
          'Обсмаживши півтори хвилини, викладаємо тонкі брусочки картоплі. Кладемо майонез, злегка солимо, посипаємо сушеним кропом. Підливаємо 250 мл прохолодної води і, встановивши мінімальний нагрів, тушкуємо приблизно 35 хвилин, орієнтуючись по готовності картоплі.',
        timeActive: 15,
        timePassive: 30,
      },
    ],
    type: [1, 5],
    photo: '/assets/images/recipies/4.jpg',
  },
  '-MqeG-zaDdadff9Sdz-3': {
    id: '5',
    name: 'ЛОКШИНА З КУРКОЮ І ОВОЧАМИ ПО-АЗІЙСЬКИ',
    ingrediends: [
      { product: 1, amount: 100, defaultUnit: MeasuringUnit.gr },
      { product: 2, amount: 1000, defaultUnit: MeasuringUnit.gr },
      { product: 4, amount: 10, defaultUnit: MeasuringUnit.gr },
    ],
    complexity: 1,
    steps: [
      {
        id: 1,
        description:
          'Філе нарізаємо на невеликі довгасті шматочки, посипаємо спеціями. Добре перемішавши, підливаємо до курятині рослинне масло і знову добре перемішуємо. Даємо промаринуватися при кімнатній температурі, протягом півгодини.',
        timeActive: 15,
        timePassive: 30,
      },
      {
        id: 2,
        description:
          'Викладаємо курятину в розпечене на сковороді олію. Обсмаживши до зміни в кольорі (м’ясо повинно побіліти), додаємо півкільця цибулі, дрібненько порубаний часник і продовжуємо готувати.',
        timeActive: 15,
        timePassive: 0,
      },
      {
        id: 3,
        description:
          'Обсмаживши півтори хвилини, викладаємо тонкі брусочки картоплі. Кладемо майонез, злегка солимо, посипаємо сушеним кропом. Підливаємо 250 мл прохолодної води і, встановивши мінімальний нагрів, тушкуємо приблизно 35 хвилин, орієнтуючись по готовності картоплі.',
        timeActive: 15,
        timePassive: 30,
      },
    ],
    type: [1, 5],
    photo: '/assets/images/recipies/5.jpg',
  },
  '-MqeG-dvDdadff9Sdz-3': {
    id: '6',
    name: 'Нагетси з соусом з журавлини',
    ingrediends: [
      { product: 1, amount: 100, defaultUnit: MeasuringUnit.gr },
      { product: 2, amount: 1000, defaultUnit: MeasuringUnit.gr },
      { product: 4, amount: 10, defaultUnit: MeasuringUnit.gr },
    ],
    complexity: 1,
    steps: [
      {
        id: 1,
        description:
          'Філе нарізаємо на невеликі довгасті шматочки, посипаємо спеціями. Добре перемішавши, підливаємо до курятині рослинне масло і знову добре перемішуємо. Даємо промаринуватися при кімнатній температурі, протягом півгодини.',
        timeActive: 15,
        timePassive: 30,
      },
      {
        id: 2,
        description:
          'Викладаємо курятину в розпечене на сковороді олію. Обсмаживши до зміни в кольорі (м’ясо повинно побіліти), додаємо півкільця цибулі, дрібненько порубаний часник і продовжуємо готувати.',
        timeActive: 15,
        timePassive: 0,
      },
      {
        id: 3,
        description:
          'Обсмаживши півтори хвилини, викладаємо тонкі брусочки картоплі. Кладемо майонез, злегка солимо, посипаємо сушеним кропом. Підливаємо 250 мл прохолодної води і, встановивши мінімальний нагрів, тушкуємо приблизно 35 хвилин, орієнтуючись по готовності картоплі.',
        timeActive: 15,
        timePassive: 30,
      },
    ],
    type: [1, 5],
    photo: '/assets/images/recipies/6.jpg',
  },
};
