import { AfterContentChecked, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/auth/services/user.service';

import { Complexity, ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { PreparationStep } from '../../models/preparationStep.interface';
import { NewRecipy, Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';

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
    private userService: UserService,
    private recipiesService: RecipiesService
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

  fillForms() {
    this.detailsFormGroup.patchValue({
      name: this.data.recipy?.name,
      complexity: this.data.recipy?.complexity,
      type: this.data.recipy?.type,
    });
    this.fillIngredientsForm();
    this.fillStepsForm();
  }

  fillIngredientsForm() {
    if (this.data.recipy?.ingrediends) {
      let ingredientsNumber = this.data.recipy?.ingrediends.length;
      let i = 1;
      while (i < ingredientsNumber) {
        this.addIngredient();
        i++;
      }
      let ingredientFormControls = this.getIngredientFormsControls();
      let ingredients = this.data.recipy.ingrediends.map((ingr) => {
        return {
          ingredient: this.recipiesService.getIngredientText(ingr),
          amount: this.recipiesService.convertAmountToSelectedUnit(
            ingr.defaultUnit,
            ingr
          ),
          defaultUnit: ingr.defaultUnit,
        };
      });
      let j = 0;
      while (j < ingredientsNumber) {
        ingredientFormControls.controls[j].patchValue(ingredients[j]);
        j++;
      }
    }
  }

  fillStepsForm() {
    if (this.data.recipy?.steps) {
      let stepsNumber = this.data.recipy.steps.length;
      let i = 1;
      while (i < stepsNumber) {
        this.addStep();
        i++;
      }
      let stepsFormControls = this.getStepsFormsControls();
      let steps = this.data.recipy.steps.map((step) => {
        return {
          id: step.id,
          description: step.description,
          timeActive: step.timeActive.toString(),
          timePassive: step.timePassive.toString(),
        };
      });

      let j = 0;
      while (j < stepsNumber) {
        stepsFormControls.controls[j].patchValue(steps[j]);
        j++;
      }
    }
  }

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

  convertIngredientsToDbFriendlyVersion() {
    return this.ingredientsFormGroup.controls.ingrediends.value.map(
      (ingr: any) => {
        ingr.product = this.recipiesService.getIngredientIdFromName(ingr);
        ingr.amount = this.recipiesService.transformToGr(ingr);
        return {
          product: ingr.product,
          amount: ingr.amount,
          defaultUnit: ingr.defaultUnit,
        };
      }
    );
  }

  convertStepsToDbFriendlyVersion() {
    return this.stepsFormGroup.controls.steps.value.map(
      (step: PreparationStep) => {
        return {
          id: step.id,
          description: step.description,
          timeActive: +step.timeActive,
          timePassive: +step.timePassive,
        };
      }
    );
  }

  addNewRecipy() {
    let recipy: NewRecipy = {
      name: this.detailsFormGroup.controls.name.value,
      ingrediends: this.convertIngredientsToDbFriendlyVersion(),
      complexity: this.detailsFormGroup.controls.complexity.value,
      type: this.detailsFormGroup.controls.type.value,
      steps: this.convertStepsToDbFriendlyVersion(),
      author: this.userService.currentUser.email,
      createdOn: Date.now(),
    };
    this.dialogRef.close({recipy, mode: this.data.mode})
  }

  addClonedRecipy() {
    if (this.data.recipy) {
      let recipy: NewRecipy = {
        name: this.detailsFormGroup.controls.name.value,
        ingrediends: this.convertIngredientsToDbFriendlyVersion(),
        complexity: this.detailsFormGroup.controls.complexity.value,
        type: this.detailsFormGroup.controls.type.value,
        steps: this.convertStepsToDbFriendlyVersion(),
        clonedBy: this.userService.currentUser.email,
        clonedOn: Date.now(),
        author: this.data.recipy.author,
        createdOn: this.data.recipy.createdOn,
        originalRecipy: this.data.recipy.id
      };
      this.dialogRef.close({ recipy, mode: this.data.mode });
    }
  }

  updateRecipy() {
    if (this.data.recipy) {
      let recipy: Recipy = {
        id: this.data.recipy.id,
        name: this.detailsFormGroup.controls.name.value,
        ingrediends: this.convertIngredientsToDbFriendlyVersion(),
        complexity: this.detailsFormGroup.controls.complexity.value,
        type: this.detailsFormGroup.controls.type.value,
        steps: this.convertStepsToDbFriendlyVersion(),
        editedBy: this.userService.currentUser.email,
        lastEdited: Date.now(),
        author: this.data.recipy.author,
        createdOn: this.data.recipy.createdOn,
      };
      this.dialogRef.close({ recipy, mode: this.data.mode });
    }
  }
  submit(){
    if(this.data.mode === 'create'){
      this.addNewRecipy()
    } else if(this.data.mode === 'edit'){
      this.updateRecipy()
    } else this.addClonedRecipy()
  }

  close(){
    this.dialogRef.close()
  }
}
