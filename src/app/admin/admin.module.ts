import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { AdminComponent } from './admin.component';
import { ProductsAdminComponent } from './containers/products-admin/products-admin.component';
import { RecipiesAdminComponent } from './containers/recipies-admin/recipies-admin.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [AdminComponent, RecipiesAdminComponent, ProductsAdminComponent]
})
export class AdminModule { }
