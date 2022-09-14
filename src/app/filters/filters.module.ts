import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../shared/shared.module';
import { FilterTagsComponent } from './components/filter-tags/filter-tags.component';

@NgModule({
  declarations: [
    FiltersComponent, FilterTagsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [FiltersComponent, FilterTagsComponent]
})
export class FiltersModule { }
