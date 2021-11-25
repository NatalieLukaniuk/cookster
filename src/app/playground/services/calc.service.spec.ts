/* tslint:disable:no-unused-variable */
import { inject, TestBed } from '@angular/core/testing';

import { CalcService } from './calc.service';

describe('Service: Calc', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalcService],
    });
  });
  const logger = jasmine.createSpyObj("LoggerService", ["log"]);
  const calcService = new CalcService(logger);

  

  it('should inject service', inject([CalcService], (service: CalcService) => {
    expect(service).toBeTruthy();
  }));

  it('should add two numbers', () => {
    const result = calcService.add(1, 2);
    expect(result).toEqual(3);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });
});
