/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductsApiService } from './products-api.service';

describe('Service: ProductsApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsApiService]
    });
  });

  it('should ...', inject([ProductsApiService], (service: ProductsApiService) => {
    expect(service).toBeTruthy();
  }));
});
