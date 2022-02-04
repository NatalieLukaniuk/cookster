import { AfterContentChecked, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/auth/services/user.service';

import { Complexity, ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { Recipy } from '../../models/recipy.interface';

interface AddEditRecipyData {
  mode: 'create' | 'edit' | 'clone';
  recipy?: Recipy;
}

@Component({
  selector: 'app-add-edit-recipy',
  templateUrl: './add-edit-recipy.component.html',
  styleUrls: ['./add-edit-recipy.component.scss'],
})
export class AddEditRecipyComponent implements OnInit, AfterContentChecked {
  ingredientsFormGroup!: FormGroup;
  stepsFormGroup!: FormGroup;
  detailsFormGroup!: FormGroup;

  isStepsFormValid: boolean = false;
  isIngredientsFormValid: boolean = false;
  isDetailsFormValid: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditRecipyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditRecipyData,
    private userService: UserService
  ) {}
  ngAfterContentChecked(): void {
    this.checkFormsValidity();
  }

  ngOnInit() {
    this.initForms();
    if (this.data.mode === 'edit' || this.data.mode === 'clone') {
      this.fillForms();
    }
  }

  initForms() {
    this.ingredientsFormGroup = new FormGroup({
      ingrediends: new FormArray([new FormControl('', Validators.required)]),
    });
    this.stepsFormGroup = new FormGroup({
      steps: new FormArray([new FormControl('', Validators.required)]),
    });

    this.detailsFormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      complexity: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
    });
  }

  goBack(): void {
    this.dialogRef.close();
  }

  addFields() {}

  fillForms() {}

  getIngredientFormsControls(): FormArray {
    return this.ingredientsFormGroup.controls['ingrediends'] as FormArray;
  }

  addIngredient() {
    (<FormArray>this.ingredientsFormGroup.controls['ingrediends']).push(
      new FormControl('')
    );
  }

  getStepsFormsControls(): FormArray {
    return this.stepsFormGroup.controls['steps'] as FormArray;
  }

  addStep() {
    (<FormArray>this.stepsFormGroup.controls['steps']).push(
      new FormControl('')
    );
  }

  get complexityOptions() {
    return [1, 2, 3];
  }

  getComplexityOptionsText(unit: Complexity) {
    return ComplexityDescription[unit];
  }

  get tags() {
    let tags: number[] = [];
    tags = Object.values(DishType).filter(
      (value) => typeof value === 'number'
    ) as number[];
    return tags;
  }

  getTagsText(tag: DishType) {
    return DishType[tag];
  }

  checkFormsValidity() {
    this.isStepsFormValid = this.checkIsStepsFormValid();
    this.isIngredientsFormValid = this.checkIsIngredientsFormValid();
    this.isDetailsFormValid = this.checkIsDetailsFormValid();
  }

  checkIsStepsFormValid() {
    let isValid = true;
    this.stepsFormGroup.value.steps.forEach((element: any) => {
      let result = Object.values(element).findIndex(
        (el: any) => el.length === 0
      );
      if (result >= 0 || element.length === 0) {
        isValid = false;
      }
    });
    return isValid;
  }

  checkIsIngredientsFormValid() {
    let isValid = true;
    this.ingredientsFormGroup.value.ingrediends.forEach((element: any) => {
      let result = Object.values(element).findIndex(
        (el: any) => el.length === 0
      );
      if (result >= 0 || element.length === 0) {
        isValid = false;
      }
    });
    return isValid;
  }

  checkIsDetailsFormValid() {
    let isValid = true;
    this.detailsFormGroup.value;
    let result = Object.values(this.detailsFormGroup.value).findIndex(
      (el: any) => el.length === 0
    );
    if (result >= 0) {
      isValid = false;
    }
    return isValid;
  }
}
