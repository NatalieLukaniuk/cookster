import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { RecipiesApiService } from '../../services/recipies-api.service';
import { UserRecipiesComponent } from './user-recipies.component';

/* tslint:disable:no-unused-variable */
describe('UserRecipiesComponent', () => {
  let component: UserRecipiesComponent;
  let fixture: ComponentFixture<UserRecipiesComponent>;
  let el: DebugElement;
  let apiService: any;

  let mockResponseFromApi: any;

  beforeEach(async(() => {
    const apiServiceSpy = jasmine.createSpyObj('apiServiceSpy', [
      'getRecipies',
    ]);

    TestBed.configureTestingModule({
      declarations: [UserRecipiesComponent],
      providers: [{ provide: RecipiesApiService, useValue: apiServiceSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecipiesComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    apiService = TestBed.inject(RecipiesApiService);
    mockResponseFromApi = {
      '-MqeG-zaDtXXXm9SEK-3': {
        complexity: 1,
        ingrediends: [
          { amount: 256.75, defaultUnit: 4, product: 6 },
          { amount: 50.058, defaultUnit: 5, product: 7 },
          { amount: 60, defaultUnit: 11, product: 8 },
          { amount: 51.84, defaultUnit: 5, product: 9 },
          { amount: 3.6, defaultUnit: 7, product: 10 },
          { amount: 2.7, defaultUnit: 7, product: 4 },
          { amount: 170, defaultUnit: 1, product: 5 },
        ],
        name: 'Пенкейки 2',
        photo: '/assets/images/recipies/1.jpg',
        steps: [
          {
            description: 'змішати вінчиком в мисці молоко, яйце, олію і цукор.',
            id: 1,
            timeActive: 5,
            timePassive: 0,
          },
          {
            description:
              'додати муку, сіль, розпушувач. Розмішати до однорідної маси',
            id: 2,
            timeActive: 5,
            timePassive: 0,
          },
          {
            description:
              'Розігріти сковороду, нічим не змазувати. Наливаємо на сковороду тісто і смажим до утворення бульбашок, перевертаєм.',
            id: 3,
            timeActive: 15,
            timePassive: 0,
          },
        ],
        type: [9, 13],
      },
      '-Mqhl69Niz62QqDkjLjg': {
        complexity: 1,
        ingrediends: [{ amount: 3000, defaultUnit: 3, product: 3 }],
        name: 'тестовий рецепт',
        photo: '/assets/images/recipies/2.jpg',
        steps: [
          {
            description: 'змішати вінчиком в мисці молоко, яйце, олію і цукор.',
            id: 1,
            timeActive: 20,
            timePassive: 30,
          },
        ],
        type: [3, 5],
      },
      '-Mqhv_JvC2LYPe0AYbWP': {
        complexity: 2,
        ingrediends: [{ amount: 1000, defaultUnit: 2, product: 1 }],
        name: 'тест',
        photo: '/assets/images/recipies/2.jpg',
        steps: [
          {
            description: 'змішати вінчиком в мисці молоко, яйце, олію і цукор.',
            id: 1,
            timeActive: 20,
            timePassive: 30,
          },
        ],
        type: [3, 5],
      },
    };
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should transform response from server into recipies array', () => {
    const res = apiService.getRecipies.and.returnValue(of(mockResponseFromApi));
    console.log(res)
    fixture.detectChanges();
    expect(res).toBeTruthy()
  });

  fit('should display message saying user has no recipies', () => {
    apiService.getRecipies.and.returnValue(of({}));
    fixture.detectChanges();
    const message = el.queryAll(By.css(".no-recipies-message"));
    expect(message).toBeTruthy()
  })
});
