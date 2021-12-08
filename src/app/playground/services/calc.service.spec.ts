/* tslint:disable:no-unused-variable */
import { inject, TestBed } from '@angular/core/testing';

import { CalcService } from './calc.service';
import { LoggerService } from './logger.service';

describe('Service: Calc', () => {
  let calcService: CalcService,
      loggerSpy: any;
  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    TestBed.configureTestingModule({
      providers: [
        CalcService,
        {provide: LoggerService, useValue: loggerSpy}
      ],
    });
    calcService = TestBed.inject(CalcService);
  });
  

  

  it('should inject service', inject([CalcService], (service: CalcService) => {
    expect(service).toBeTruthy();
  }));

  it('should add two numbers', () => {    
    const result = calcService.add(1, 2);
    expect(result).toEqual(3);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
  it('should substract two numbers', () => {
    const result = calcService.substract(3, 2);
    expect(result).toEqual(1);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  })
});
