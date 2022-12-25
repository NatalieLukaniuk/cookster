import { FiltersModule } from './../filters/filters.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FiltersModule
  ],
  declarations: [HeaderComponent, LoadingIndicatorComponent],
  exports: [HeaderComponent, LoadingIndicatorComponent]
})
export class UiModule { }
