import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { MeasuringUnit, MeasuringUnitOptions } from '../../models/measuring-units.enum';
import { ProductsService } from '../../services/products.service';
import { MeasuringUnitText } from './../../models/measuring-units.enum';
import { ProductTypeOptions, ProductTypeText } from './../../services/products-database.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddProductComponent>, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      density: new FormControl(''),
      grInOneItem: new FormControl(''),
      calories: new FormControl(''),
      defaultUnit: new FormControl(''),
      type: new FormControl(''),
    });
  }

  get measuringUnits(): MeasuringUnit[] {
    return MeasuringUnitOptions;
  }
  getMeasuringUnitText(unit: any) {
    return MeasuringUnitText[unit];
  }

  get productTypes() {
    return ProductTypeOptions;
  }

  getProductTypeText(type: number) {
    return ProductTypeText[type];
  }

  submit(){
    this.dialogRef.close(this.productForm.value)
  }

  goBack(){
    this.dialogRef.close()
  }
}
