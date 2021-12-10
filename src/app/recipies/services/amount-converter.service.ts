import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AmountConverterService {
  grToKg(amount: number) {
    return amount / 1000;
  }

  grToBunch(amount:number){
    return amount / 40;
  }

  grToPinch(amount:number){
    return amount / 3;
  }

  grToLiter(amount: number, density: number){ // density is in kg/m3
    return amount / density;
  }

  literToMl(amount: number){
    return amount * 1000;
  }

  grToTableSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 18;
  }

  grToTeaSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 5;
  }

  grToDessertSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 10;
  }

  grToCoffeeSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 2.5;
  }

  grToGlass(amount: number, density: number){ // density is in kg/m3, glass can fit 200ml
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 200;
  }

  
  
}
