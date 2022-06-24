import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RecipiesModule } from './../recipies/recipies.module';
import { NoGroupListComponent } from './components/no-group-list/no-group-list.component';
import { NoListsPlaceholderComponent } from './components/no-lists-placeholder/no-lists-placeholder.component';
import { ShoppingListComponent } from './shopping-list.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RecipiesModule
  ],
  declarations: [ShoppingListComponent, NoGroupListComponent, NoListsPlaceholderComponent, ]
})
export class ShoppingListModule { }
