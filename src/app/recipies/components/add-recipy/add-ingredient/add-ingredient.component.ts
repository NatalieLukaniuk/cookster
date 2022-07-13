import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { GetUkrIngredientsGroup, Ingredient, IngredientsGroupOptions } from 'src/app/recipies/models/ingredient.interface';
import { MeasuringUnit, MeasuringUnitOptions, MeasuringUnitText } from 'src/app/recipies/models/measuring-units.enum';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';


@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
})
export class AddIngredientComponent implements OnInit, OnChanges {

  @Input() isIngredientsSplitToGroups: boolean = false;
  @Output() addNewIngredient: EventEmitter<Ingredient> = new EventEmitter<Ingredient>()

  public ingredientsForm!: UntypedFormGroup;

  filteredOptions: Observable<string[]> | undefined;
  noFilteredOptions: boolean = false;
  MeasuringUnit = MeasuringUnit;

  GetUkrIngredientsGroup = GetUkrIngredientsGroup;

  constructor(private recipiesService: RecipiesService) { 
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isIngredientsSplitToGroups && !!this.ingredientsForm) {
      this.ingredientsForm.addControl('group', new UntypedFormControl('', Validators.required))
    }
  }

  initForm(){
    this.ingredientsForm = new UntypedFormGroup({
      ingredient: new UntypedFormControl('', Validators.required),
      amount: new UntypedFormControl('', Validators.required),
      defaultUnit: new UntypedFormControl(MeasuringUnit.gr, Validators.required),
    });
    if (this.isIngredientsSplitToGroups){
      this.ingredientsForm.addControl('group', new UntypedFormControl('', Validators.required))
    }
  }

  ngOnInit() {
    this.initForm()
    this.filteredOptions = this.ingredientsForm.controls.ingredient.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value)),
      tap(res => {
        if (!res.length) {
          this.noFilteredOptions = true;
        } else {
          this.noFilteredOptions = false;
        }
      })
    );

  }

  private _filter(value: string): string[] {
    if(value){
      const filterValue = value.toLowerCase();
    return this.availableProducts.filter(option => option.toLowerCase().includes(filterValue));
    } else return this.availableProducts
    
  }

  get measuringUnitsOptions() {
    return MeasuringUnitOptions;
  }

  get ingredientGroupOptions() {
    return IngredientsGroupOptions;
  }

  getMeasuringUnitText(unit: MeasuringUnit) {
    return MeasuringUnitText[unit]
  }

  get availableProducts() {
    let products = [];
    for (let product of this.recipiesService.products$.value) {
      products.push(product.name)
    }
    return products;
  }

  getProductId(option: string) {
    let productId;
    for (let product of this.recipiesService.products$.value) {
      if (product.name === option) {
        productId = product.id;
      }
    }
    return productId;
  }

  addIngredient() {
    if(this.ingredientsForm.controls.defaultUnit.value == MeasuringUnit.none){
      this.ingredientsForm.controls.amount.setValue(0)
    }
    this.addNewIngredient.emit(this.ingredientsForm.value)
  }

  resetForm(){
    this.ingredientsForm.reset()
  }

  // get measurementUnits() {
  //   let optionsArray: MeasuringUnit[] = [];
  //   switch (this.productType) {
  //     case ProductType.fluid:
  //       optionsArray = MeasuringUnitOptionsFluid;
  //       break;
  //     case ProductType.hardItem:
  //       optionsArray = MeasuringUnitOptionsHardItems;
  //       break;
  //     case ProductType.herb:
  //       optionsArray = MeasuringUnitOptionsHerbs;
  //       break;
  //     case ProductType.spice:
  //       optionsArray = MeasuringUnitOptionsSpice;
  //   }
  //   return optionsArray;
  // }
}
