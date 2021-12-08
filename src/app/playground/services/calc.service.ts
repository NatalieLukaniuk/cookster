import { Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class CalcService {

constructor(private logger: LoggerService) { }

add(number1: number, number2: number){
  this.logger.log(number1 +  number2);
  return number1 +  number2;
}

substract(number1: number, number2: number){
  this.logger.log(number1 - number2);
  return number1 - number2;
}

}
