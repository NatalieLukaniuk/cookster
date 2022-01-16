import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AmountConverterService } from '../../services/amount-converter.service';
import { RecipiesService } from '../../services/recipies.service';
import { IngredientComponent } from './ingredient.component';

fdescribe('IngredientComponent', () => {
  let converterSpy: any, recipiesSpy: any;
  let component: IngredientComponent;
  let fixture: ComponentFixture<IngredientComponent>;

  beforeEach(
    waitForAsync(() => {
      converterSpy = jasmine.createSpyObj('AmountConverterService', [
        'grToKg',
        'grToLiter',
        'grToMl',
        'grToTableSpoons',
        'grToDessertSpoons',
        'grToTeaSpoons',
        'grToCoffeeSpoons',
      ]);
      recipiesSpy = jasmine.createSpyObj('RecipiesService', ['getGrPerItem']);
      TestBed.configureTestingModule({
        declarations: [IngredientComponent],
        providers: [
          { provide: AmountConverterService, useValue: converterSpy },
          { provide: RecipiesService, useValue: recipiesSpy },
        ],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(IngredientComponent);
          component = fixture.componentInstance;
        });
    })
  );
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display', () => {
    const ingredient = { product: 1, amount: 1000, defaultUnit: 1 };
  });
});
