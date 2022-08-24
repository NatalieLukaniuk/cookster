import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { AdminComponent } from './admin.component';
import { UpdateGramsInItemComponent } from './components/update-grams-in-item/update-grams-in-item.component';
import { ProductsAdminComponent } from './containers/products-admin/products-admin.component';
import { RecipiesAdminComponent } from './containers/recipies-admin/recipies-admin.component';
import { UpdateProductsComponent } from './containers/update-products/update-products.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AdminComponent, RecipiesAdminComponent, ProductsAdminComponent, UpdateProductsComponent, UpdateGramsInItemComponent]
})
export class AdminModule { }
