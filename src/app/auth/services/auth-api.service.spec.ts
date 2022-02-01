/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthApiService } from './auth-api.service';

describe('Service: AuthApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthApiService]
    });
  });

  it('should ...', inject([AuthApiService], (service: AuthApiService) => {
    expect(service).toBeTruthy();
  }));
});
