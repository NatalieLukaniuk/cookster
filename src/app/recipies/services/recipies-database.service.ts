import { Injectable } from '@angular/core';

import { Recipy } from '../models/recipy.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipiesDatabaseService {
  recipies: Recipy[] = [
    {
      id: 1,
      name: 'Ароматна запечена скумбрія',
      ingrediends: [{ product: 1, amount: 100 }],
      complexity: 1,
      steps: [],
      type: [1, 5],
      photo: '/assets/images/recipies/1.jpg',
    },
    {
      id: 2,
      name: 'Запечена в духовці картопля в мундирі',
      ingrediends: [
        { product: 2, amount: 1850 },
        { product: 3, amount: 18 },
        { product: 4, amount: 3 },
      ],
      complexity: 1,
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
      type: [1, 3, 12],
      photo: '/assets/images/recipies/2.jpg',
    },
  ];
}
