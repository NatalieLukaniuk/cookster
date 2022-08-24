import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MeasuringUnit } from 'src/app/recipies/models/measuring-units.enum';
import { Product } from 'src/app/recipies/models/products.interface';
import { Recipy } from 'src/app/recipies/models/recipy.interface';

import { ProductType } from './../../../recipies/models/products.interface';
import * as RecipiesActions from './../../../store/actions/recipies.actions';

@Component({
  selector: 'app-update-grams-in-item',
  templateUrl: './update-grams-in-item.component.html',
  styleUrls: ['./update-grams-in-item.component.scss'],
})
export class UpdateGramsInItemComponent implements OnInit {
  @Input()
  products!: Product[];
  @Input()
  recipies!: Recipy[];
  ingredientsForm!: UntypedFormGroup;
  filteredOptions: Observable<string[]> | undefined;
  noFilteredOptions: boolean = false;
  constructor(private store: Store) {}

  ngOnInit() {
    this.initForm();
    this.filteredOptions =
      this.ingredientsForm.controls.ingredient.valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filter(value)),
        tap((res) => {
          if (!res.length) {
            this.noFilteredOptions = true;
          } else {
            this.noFilteredOptions = false;
          }
        })
      );
  }
  initForm() {
    this.ingredientsForm = new UntypedFormGroup({
      ingredient: new UntypedFormControl('', Validators.required),
      newValue: new UntypedFormControl('', Validators.required),
    });
  }

  private _filter(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.availableProducts.filter((option) =>
        option.toLowerCase().includes(filterValue)
      );
    } else return this.availableProducts;
  }

  get availableProducts() {
    let products = [];
    for (let product of this.products) {
      if (product.type == ProductType.hardItem) {
        products.push(product.name);
      }
    }
    return products;
  }

  apply() {
    const ingrId = this.getProductId(
      this.ingredientsForm.controls.ingredient.value
    );
    console.log(ingrId);
    const newGrInItem = this.ingredientsForm.controls.newValue.value;
    console.log(newGrInItem);
    const oldGrams = this.products.find(
      (prod) => prod.id == ingrId
    )!.grInOneItem;
    console.log(oldGrams);
    let recipiesWithIngrInItems = this.recipies.filter((recipy) =>
      recipy.ingrediends.find(
        (ingr) =>
          ingr.product == ingrId && ingr.defaultUnit == MeasuringUnit.item
      )
    );

    recipiesWithIngrInItems.forEach((recipy) => {
      let updatedIng = recipy.ingrediends.map((ingr) => {
        if (ingr.product == ingrId) {
          return {
            ...ingr,
            amount: (ingr.amount / oldGrams!) * newGrInItem,
          };
        } else return ingr;
      });
      let updatedRecipy: Recipy = {
        ...recipy,
        ingrediends: updatedIng,
      };
      console.log(updatedRecipy);
      this.store.dispatch(
        new RecipiesActions.UpdateRecipyAction(updatedRecipy)
      );
    });
    let prod = this.products.find((prod) => prod.id == ingrId);
    if (prod) {
      let updatedProduct: Product = {
        ...prod,
        grInOneItem: newGrInItem,
      };
      this.store.dispatch(
        new RecipiesActions.UpdateProductAction(updatedProduct)
      );
    }
  }

  getProductId(option: string) {
    let productId;
    for (let product of this.products) {
      if (product.name === option) {
        productId = product.id;
      }
    }
    return productId;
  }
}
