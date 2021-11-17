import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { HeaderComponent } from './containers/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent, MatButtonModule]
})
export class SharedModule { }
