import { inject, TestBed } from '@angular/core/testing';

import { RecipiesService } from './recipies.service';

/* tslint:disable:no-unused-variable */

xdescribe('Service: Recipies', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipiesService]
    });
  });

  it('should ...', inject([RecipiesService], (service: RecipiesService) => {
    expect(service).toBeTruthy();
  }));


});
