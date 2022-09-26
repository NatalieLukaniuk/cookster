import { SharedModule } from './../shared/shared.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrepListsComponent } from './components/prep-lists/prep-lists.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [PrepListsComponent],
  exports: [PrepListsComponent]
})
export class AdvancePreparationModule { }
