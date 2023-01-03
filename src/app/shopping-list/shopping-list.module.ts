import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RecipiesModule } from './../recipies/recipies.module';
import { NoGroupListComponent } from './components/no-group-list/no-group-list.component';
import { NoListsPlaceholderComponent } from './components/no-lists-placeholder/no-lists-placeholder.component';
import { ShoppingListItemComponent } from './components/shopping-list-item/shopping-list-item.component';
import { ShoppingListComponent } from './shopping-list.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RecipiesModule,
    FormsModule
  ],
  declarations: [ShoppingListComponent, NoGroupListComponent, NoListsPlaceholderComponent, ShoppingListItemComponent, ],
  exports: [ShoppingListComponent]
})
export class ShoppingListModule { }
