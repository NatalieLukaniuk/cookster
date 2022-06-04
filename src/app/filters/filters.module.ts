import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    FiltersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [FiltersComponent]
})
export class FiltersModule { }
