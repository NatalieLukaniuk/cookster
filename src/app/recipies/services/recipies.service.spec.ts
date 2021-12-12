/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecipiesService } from './recipies.service';

describe('Service: Recipies', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipiesService]
    });
  });

  it('should ...', inject([RecipiesService], (service: RecipiesService) => {
    expect(service).toBeTruthy();
  }));
});
