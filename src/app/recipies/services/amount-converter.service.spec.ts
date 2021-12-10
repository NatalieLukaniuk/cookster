import { inject, TestBed } from '@angular/core/testing';

import { AmountConverterService } from './amount-converter.service';

/* tslint:disable:no-unused-variable */

describe('Service: AmountConverter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmountConverterService]
    });
    
  });

  it('should ...', inject([AmountConverterService], (service: AmountConverterService) => {
    expect(service).toBeTruthy();
  }));

  fit('should convert gr to kg', () => {
    const converter = new AmountConverterService();
    const amountInGr = 100;
    const amountInKg = converter.grToKg(amountInGr);
    expect(amountInKg).toEqual(0.1);
  })

  fit('should convert gr to bunches', () => {
    const converter = new AmountConverterService();
    const amountInGr = 80;
    const converted = converter.grToBunch(amountInGr);
    expect(converted).toEqual(2);
  })

  fit('should convert gr to pinches', () => {
    const converter = new AmountConverterService();
    const amountInGr = 6;
    const converted = converter.grToPinch(amountInGr);
    expect(converted).toEqual(2);
  })

  fit('should convert gr to litres', () => {
    const converter = new AmountConverterService();
    const amountInGr = 300;
    const density = 1000;
    const converted = converter.grToLiter(amountInGr, density);
    expect(converted).toEqual(0.3);
  })

  fit('should convert litres to milliliters', () => {
    const converter = new AmountConverterService();
    const amountInL = 3;
    const converted = converter.literToMl(amountInL);
    expect(converted).toEqual(3000);
  })

  fit('should convert grams to table spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 54;    
    const density = 1000;
    const converted = converter.grToTableSpoons(amountInGr, density);
    expect(converted).toEqual(3);
  })

  fit('should convert grams to tea spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 15;    
    const density = 1000;
    const converted = converter.grToTeaSpoons(amountInGr, density);
    expect(converted).toEqual(3);
  })

  fit('should convert grams to dessert spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 150;    
    const density = 1000;
    const converted = converter.grToDessertSpoons(amountInGr, density);
    expect(converted).toEqual(15);
  })

  fit('should convert grams to coffee spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 50;    
    const density = 1000;
    const converted = converter.grToCoffeeSpoons(amountInGr, density);
    expect(converted).toEqual(20);
  })

  fit('should convert grams to glasses', () => {
    const converter = new AmountConverterService();
    const amountInGr = 200;    
    const density = 1000;
    const converted = converter.grToGlass(amountInGr, density);
    expect(converted).toEqual(1);
  })
  
});
