import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { FiltersModule } from './../filters/filters.module';
import { RecipiesModule } from './../recipies/recipies.module';
import { MenusComponent } from './menus.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FiltersModule,
    FormsModule,
    RecipiesModule,
  ],
  declarations: [MenusComponent],
})
export class MenusModule {}
