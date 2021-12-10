import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AmountConverterService {
  grToKg(amount: number) {
    return amount / 1000;
  }

  kgToGR(amount: number) {
    return amount * 1000;
  }

  grToBunch(amount:number){
    return amount / 40;
  }

  bunchToGr(amount:number){
    return amount * 40;
  }

  grToPinch(amount:number){
    return amount / 3;
  }

  pinchToGr(amount:number){
    return amount * 3;
  }

  grToLiter(amount: number, density: number){ // density is in kg/m3
    return amount / density;
  }

  literToGr(amount: number, density: number){ // density is in kg/m3
    return amount * density;
  }

  literToMl(amount: number){
    return amount * 1000;
  }

  mlToL(amount: number){
    return amount / 1000;
  }


  grToMl(amount: number, density: number){// density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml;
  }

  mlToGr(amount: number, density: number){
    const l = this.mlToL(amount);
    const gr = this.literToGr(l, density);
    return gr;
  }

  grToTableSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 18;
  }

  tableSpoonsToGr(amount: number, density: number){ // density is in kg/m3
    const ml = amount * 18;
    const l = this.mlToL(ml);
    const gr = this.literToGr(l, density);
    return gr;
  }

  grToTeaSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 5;
  }

  teaSpoonsToGr(amount: number, density: number){ // density is in kg/m3
    const ml = amount * 5;
    const l = this.mlToL(ml);
    const gr = this.literToGr(l, density);
    return gr;
  }

  grToDessertSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 10;
  }

  dessertSpoonsToGr(amount: number, density: number){ // density is in kg/m3
    const ml = amount * 10;
    const l = this.mlToL(ml);
    const gr = this.literToGr(l, density);
    return gr;
  }

  grToCoffeeSpoons(amount: number, density: number){ // density is in kg/m3
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 2.5;
  }

  coffeeSpoonsToGr(amount: number, density: number){ // density is in kg/m3
    const ml = amount * 2.5;
    const l = this.mlToL(ml);
    const gr = this.literToGr(l, density);
    return gr;
  }

  grToGlass(amount: number, density: number){ // density is in kg/m3, glass can fit 200ml
    const l = this.grToLiter(amount, density);
    const ml = this.literToMl(l);
    return ml / 200;
  }

  glassToGr(amount: number, density: number){ // density is in kg/m3, glass can fit 200ml
    const ml = amount * 200;
    const l = this.mlToL(ml);
    const gr = this.literToGr(l, density);
    return gr;
  }

  
  
}
