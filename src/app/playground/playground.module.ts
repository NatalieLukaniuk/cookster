import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PlaygroundComponent } from './playground.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PlaygroundComponent],
  exports: [PlaygroundComponent]
})
export class PlaygroundModule { }
