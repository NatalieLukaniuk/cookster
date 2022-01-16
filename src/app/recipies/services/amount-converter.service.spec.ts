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

  it('should convert gr to kg', () => {
    const converter = new AmountConverterService();
    const amountInGr = 100;
    const amountInKg = converter.grToKg(amountInGr);
    expect(amountInKg).toEqual(0.1);
  })

  it('should convert kg to gr', () => {
    const converter = new AmountConverterService();
    const amount = 10;
    const amountInGr = converter.kgToGR(amount);
    expect(amountInGr).toEqual(10000);
  })

  it('should convert gr to bunches', () => {
    const converter = new AmountConverterService();
    const amountInGr = 80;
    const converted = converter.grToBunch(amountInGr);
    expect(converted).toEqual(2);
  })

  it('should convert bunches to gr', () => {
    const converter = new AmountConverterService();
    const amount = 2;
    const converted = converter.bunchToGr(amount);
    expect(converted).toEqual(80);
  })

  it('should convert gr to pinches', () => {
    const converter = new AmountConverterService();
    const amountInGr = 6;
    const converted = converter.grToPinch(amountInGr);
    expect(converted).toEqual(2);
  })

  it('should convert pinches to gr', () => {
    const converter = new AmountConverterService();
    const amount = 2;
    const converted = converter.pinchToGr(amount);
    expect(converted).toEqual(6);
  })

  it('should convert gr to litres', () => {
    const converter = new AmountConverterService();
    const amountInGr = 300;
    const density = 1000;
    const converted = converter.grToLiter(amountInGr, density);
    expect(converted).toEqual(0.3);
  })

  it('should convert litres to gr', () => {
    const converter = new AmountConverterService();
    const amount = 0.3;
    const density = 1000;
    const converted = converter.literToGr(amount, density);
    expect(converted).toEqual(300);
  })

  it('should convert litres to milliliters', () => {
    const converter = new AmountConverterService();
    const amountInL = 3;
    const converted = converter.literToMl(amountInL);
    expect(converted).toEqual(3000);
  })

  it('should convert milliliters to litres', () => {
    const converter = new AmountConverterService();
    const amount = 3000;
    const converted = converter.mlToL(amount);
    expect(converted).toEqual(3);
  })

  it('should convert grams to table spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 54;    
    const density = 1000;
    const converted = converter.grToTableSpoons(amountInGr, density);
    expect(converted).toEqual(3);
  })

  it('should convert table spoons to grams', () => {
    const converter = new AmountConverterService();
    const amountInGr = 3;    
    const density = 1000;
    const converted = converter.tableSpoonsToGr(amountInGr, density);
    expect(converted).toEqual(54);
  })

  it('should convert grams to tea spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 15;    
    const density = 1000;
    const converted = converter.grToTeaSpoons(amountInGr, density);
    expect(converted).toEqual(3);
  })

  it('should convert tea spoons to grams', () => {
    const converter = new AmountConverterService();
    const amountInGr = 3;    
    const density = 1000;
    const converted = converter.teaSpoonsToGr(amountInGr, density);
    expect(converted).toEqual(15);
  })

  it('should convert grams to dessert spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 150;    
    const density = 1000;
    const converted = converter.grToDessertSpoons(amountInGr, density);
    expect(converted).toEqual(15);
  })

  it('should convert dessert spoons to grams', () => {
    const converter = new AmountConverterService();
    const amountInGr = 15;    
    const density = 1000;
    const converted = converter.dessertSpoonsToGr(amountInGr, density);
    expect(converted).toEqual(150);
  })

  it('should convert grams to coffee spoons', () => {
    const converter = new AmountConverterService();
    const amountInGr = 50;    
    const density = 1000;
    const converted = converter.grToCoffeeSpoons(amountInGr, density);
    expect(converted).toEqual(20);
  })

  it('should convert coffee spoons to grams', () => {
    const converter = new AmountConverterService();
    const amountInGr = 20;    
    const density = 1000;
    const converted = converter.coffeeSpoonsToGr(amountInGr, density);
    expect(converted).toEqual(50);
  })

  it('should convert grams to glasses', () => {
    const converter = new AmountConverterService();
    const amountInGr = 200;    
    const density = 1000;
    const converted = converter.grToGlass(amountInGr, density);
    expect(converted).toEqual(1);
  })

  it('should convert glasses to grams', () => {
    const converter = new AmountConverterService();
    const amountInGr = 1;    
    const density = 1000;
    const converted = converter.glassToGr(amountInGr, density);
    expect(converted).toEqual(200);
  })
  
});
