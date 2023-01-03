import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './components/filters/filters.component';
import { SharedModule } from '../shared/shared.module';
import { FilterTagsComponent } from './components/filter-tags/filter-tags.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';

@NgModule({
  declarations: [
    FiltersComponent, FilterTagsComponent, SearchFilterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [FiltersComponent, FilterTagsComponent, SearchFilterComponent]
})
export class FiltersModule { }
