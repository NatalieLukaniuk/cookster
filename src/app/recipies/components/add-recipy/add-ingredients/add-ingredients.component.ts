import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText } from './../../../models/measuring-units.enum';
import { ProductsDatabaseService } from './../../../services/products-database.service';

@Component({
  selector: 'app-add-ingredients',
  templateUrl: './add-ingredients.component.html',
  styleUrls: ['./add-ingredients.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddIngredientsComponent),
      multi: true
    }
  ]
})
export class AddIngredientsComponent implements OnInit, ControlValueAccessor {
  public ingredientsForm: FormGroup = new FormGroup({
    ingredient: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    defaultUnit: new FormControl('', Validators.required),
  });

  filteredOptions: Observable<string[]> | undefined;
  noFilteredOptions: boolean = false;

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.ingredientsForm.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    console.log("on change");
    this.ingredientsForm.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.ingredientsForm.disable() : this.ingredientsForm.enable();
  }

  constructor(private productsDb: ProductsDatabaseService) {}

  ngOnInit() {
    this.filteredOptions = this.ingredientsForm.controls.ingredient.valueChanges.pipe(
      startWith(''),
      map((value:string) => this._filter(value)),
      tap(res => {
        if(!res.length){
          this.noFilteredOptions = true;
        } else {
          this.noFilteredOptions = false;
        }
      })
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.availableProducts.filter(option => option.toLowerCase().includes(filterValue));
  }

  get measuringUnitsOptions(){
    return MeasuringUnitOptions;
  }

  getMeasuringUnitText(unit: MeasuringUnit){
    return MeasuringUnitText[unit]
  }

  get availableProducts(){
    let products = [];
    for (let product of this.productsDb.products) {
      products.push(product.name)
    }
    return products;
  }

  getProductId(option: string){
    let productId;
    for (let product of this.productsDb.products) {
      if (product.name === option) {
        productId = product.id;
      }
    }
    return productId;
  }

}
