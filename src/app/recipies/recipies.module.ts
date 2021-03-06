import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AddEditIngredientComponent } from './components/add-edit-recipy/add-edit-ingredient/add-edit-ingredient.component';
import { AddEditRecipyComponent } from './components/add-edit-recipy/add-edit-recipy.component';
import { AddStepsComponent } from './components/add-edit-recipy/add-steps/add-steps.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { RecipyFullViewComponent } from './components/recipy-full-view/recipy-full-view.component';
import { RecipyShortViewComponent } from './components/recipy-short-view/recipy-short-view.component';
import { AllRecipiesComponent } from './containers/all-recipies/all-recipies.component';
import { UserRecipiesComponent } from './containers/user-recipies/user-recipies.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    UserRecipiesComponent,
    RecipyShortViewComponent,
    RecipyFullViewComponent,
    IngredientComponent,
    AddStepsComponent,
    AddProductComponent,
    AllRecipiesComponent,
    AddEditRecipyComponent,
    AddEditIngredientComponent
  ],
  exports: [],
})
export class RecipiesModule {}
