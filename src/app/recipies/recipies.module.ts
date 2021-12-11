import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AddRecipyComponent } from './components/add-recipy/add-recipy.component';
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
  ],
})
export class RecipiesModule {}
