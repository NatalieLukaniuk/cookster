import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ComplexityDescription } from '../../models/complexity.enum';
import { Complexity } from './../../models/complexity.enum';
import { DishType } from './../../models/dishType.enum';

@Component({
  selector: 'app-add-recipy',
  templateUrl: './add-recipy.component.html',
  styleUrls: ['./add-recipy.component.scss'],
})
export class AddRecipyComponent implements OnInit {
  recipyForm!: FormGroup;
  isStepsFormValid: boolean = false;
  constructor(public dialogRef: MatDialogRef<AddRecipyComponent>) {}

  ngOnInit() {
    this.recipyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      ingrediends: new FormArray([new FormControl('', Validators.required)]),
      complexity: new FormControl(''),
      steps: new FormArray([new FormControl('')]),
      type: new FormControl(''),
    });
  }
  goBack(): void {
    this.dialogRef.close();
  }

  getIngredientFormsControls(): FormArray {
    return this.recipyForm.controls['ingrediends'] as FormArray;
  }

  addIngredient() {
    (<FormArray>this.recipyForm.controls['ingrediends']).push(
      new FormControl('')
    );
  }

  getStepsFormsControls(): FormArray {
    return this.recipyForm.controls['steps'] as FormArray;
  }

  addStep() {
    (<FormArray>this.recipyForm.controls['steps']).push(new FormControl(''));
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

  submit() {
    this.dialogRef.close(this.recipyForm.value);
  }

  onStepsFormChange(event: boolean) {
    this.isStepsFormValid = event;
    console.log(this.isStepsFormValid);
  }
}
