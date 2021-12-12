import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AddIngredientsComponent } from './components/add-recipy/add-ingredients/add-ingredients.component';
import { AddRecipyComponent } from './components/add-recipy/add-recipy.component';
import { AddStepsComponent } from './components/add-recipy/add-steps/add-steps.component';
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { RecipyFullViewComponent } from './components/recipy-full-view/recipy-full-view.component';
import { RecipyShortViewComponent } from './components/recipy-short-view/recipy-short-view.component';
import { UserRecipiesComponent } from './containers/user-recipies/user-recipies.component';

@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule],
  declarations: [
    UserRecipiesComponent,
    RecipyShortViewComponent,
    RecipyFullViewComponent,
    IngredientComponent,
    AddRecipyComponent,
    AddStepsComponent,
    AddIngredientsComponent
  ],
})
export class RecipiesModule {}
