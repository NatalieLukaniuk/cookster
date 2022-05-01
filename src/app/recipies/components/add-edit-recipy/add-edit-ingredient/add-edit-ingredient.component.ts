import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { GetUkrIngredientsGroup, IngredientsGroupOptions } from 'src/app/recipies/models/ingredient.interface';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText } from 'src/app/recipies/models/measuring-units.enum';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

@Component({
  selector: 'app-add-edit-ingredient',
  templateUrl: './add-edit-ingredient.component.html',
  styleUrls: ['./add-edit-ingredient.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEditIngredientComponent),
      multi: true
    }
  ]
})
export class AddEditIngredientComponent implements OnInit, OnChanges {

  @Input() isIngredientsSplitToGroups: boolean = false;

  public ingredientsForm: FormGroup = new FormGroup({
    ingredient: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    defaultUnit: new FormControl('', Validators.required),
  });

  filteredOptions: Observable<string[]> | undefined;
  noFilteredOptions: boolean = false;

  GetUkrIngredientsGroup = GetUkrIngredientsGroup;

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.ingredientsForm.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    this.ingredientsForm.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.ingredientsForm.disable() : this.ingredientsForm.enable();
  }

  constructor(private recipiesService: RecipiesService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if(this.isIngredientsSplitToGroups){
      this.ingredientsForm.addControl('group', new FormControl('', Validators.required))
    }
  }

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

  get ingredientGroupOptions(){
    return IngredientsGroupOptions;
  }

  getMeasuringUnitText(unit: MeasuringUnit){
    return MeasuringUnitText[unit]
  }

  get availableProducts(){
    let products = [];
    for (let product of this.recipiesService.products$.value) {
      products.push(product.name)
    }
    return products;
  }

  getProductId(option: string){
    let productId;
    for (let product of this.recipiesService.products$.value) {
      if (product.name === option) {
        productId = product.id;
      }
    }
    return productId;
  }
}
