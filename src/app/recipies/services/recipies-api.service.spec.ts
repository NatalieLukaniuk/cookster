import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

import { recipies } from '../models/recipies-database';
import { RecipiesApiService } from './recipies-api.service';

/* tslint:disable:no-unused-variable */

describe('Service: RecipiesApi', () => {
  let recipiesApiService: RecipiesApiService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipiesApiService],
    });

    recipiesApiService = TestBed.inject(RecipiesApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should ...', inject(
    [RecipiesApiService],
    (service: RecipiesApiService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should retrieve all recipies', () => {
    recipiesApiService.getRecipies().subscribe((recipies) => {
      expect(recipies).withContext('No recipies returned').toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      'https://cookster-12ac8-default-rtdb.firebaseio.com/recipies.json'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(recipies);
  });

  it('should find recipy by id', () => {
    recipiesApiService
      .getRecipyById('-MqeG-zaDtXXXm9SEK-3')
      .subscribe((recipy: Recipy) => {
        expect(recipy).toBeTruthy();
        expect(recipy.name).toEqual(
          'Тушковане філе курки з картоплею, часником і майонезом на сковороді'
        );
      });
    const req = httpTestingController.expectOne(
      'https://cookster-12ac8-default-rtdb.firebaseio.com/recipies/-MqeG-zaDtXXXm9SEK-3.json'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(recipies['-MqeG-zaDtXXXm9SEK-3']);
  });

  it('should give an error when get course by id fails', () => {
    recipiesApiService.getRecipyById('-MqeG-zaDtXXXm9SEK-3').subscribe(
      () => {},
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(500);
      }
    );

    const req = httpTestingController.expectOne(
      'https://cookster-12ac8-default-rtdb.firebaseio.com/recipies/-MqeG-zaDtXXXm9SEK-3.json'
    );
    expect(req.request.method).toEqual('GET');

    req.flush('Get recipy failed', {status: 500, statusText: 'Internal server error'})
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
