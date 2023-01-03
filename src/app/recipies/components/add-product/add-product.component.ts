import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { MeasuringUnit, MeasuringUnitOptions } from '../../models/measuring-units.enum';
import { ProductTypeOptions, ProductTypeText } from '../../models/products.interface';
import { MeasuringUnitText } from './../../models/measuring-units.enum';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm!: UntypedFormGroup;
  constructor(public dialogRef: MatDialogRef<AddProductComponent>) {}

  ngOnInit(): void {
    this.productForm = new UntypedFormGroup({
      name: new UntypedFormControl('', Validators.required),
      density: new UntypedFormControl(''),
      grInOneItem: new UntypedFormControl(''),
      calories: new UntypedFormControl(''),
      defaultUnit: new UntypedFormControl(''),
      type: new UntypedFormControl(''),
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
