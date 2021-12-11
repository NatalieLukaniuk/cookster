/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecipiesApiService } from './recipies-api.service';

describe('Service: RecipiesApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipiesApiService]
    });
  });

  it('should ...', inject([RecipiesApiService], (service: RecipiesApiService) => {
    expect(service).toBeTruthy();
  }));
});
