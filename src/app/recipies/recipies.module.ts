import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AddProductComponent } from './components/add-product/add-product.component';
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { RecipyFullViewComponent } from './containers/recipy-full-view/recipy-full-view.component';
import { RecipyShortViewComponent } from './components/recipy-short-view/recipy-short-view.component';
import { AllRecipiesComponent } from './containers/all-recipies/all-recipies.component';
import { UserRecipiesComponent } from './containers/user-recipies/user-recipies.component';

import { AddIngredientComponent } from './components/add-recipy/add-ingredient/add-ingredient.component';
import { AddStepComponent } from './components/add-recipy/add-step-form/add-step.component';
import { AddTagsComponent } from './components/add-recipy/add-tags/add-tags.component';
import { RecipyPreviewComponent } from './components/recipy-preview/recipy-preview.component';
import { EditRecipyComponent } from './containers/edit-recipy/edit-recipy.component';
import { AddRecipyComponent } from './components/add-recipy/add-recipy.component';
import { RecipiesReducers } from '../store/reducers/recipies.reducer';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forFeature('recipies', RecipiesReducers)
  ],
  declarations: [
    UserRecipiesComponent,
    RecipyShortViewComponent,
    RecipyFullViewComponent,
    IngredientComponent,
    AddProductComponent,
    AllRecipiesComponent,
    AddRecipyComponent,
    AddIngredientComponent,
    AddStepComponent,
    AddTagsComponent,
    RecipyPreviewComponent,
    EditRecipyComponent
  ],
  exports: [],
})
export class RecipiesModule {}
