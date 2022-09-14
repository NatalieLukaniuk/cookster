import { FiltersModule } from './../filters/filters.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FiltersModule
  ],
  declarations: [HeaderComponent,],
  exports: [HeaderComponent,]
})
export class UiModule { }
