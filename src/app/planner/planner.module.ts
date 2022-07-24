import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from './../calendar/calendar.module';
import { RecipiesModule } from './../recipies/recipies.module';
import { SharedModule } from './../shared/shared.module';
import { RecipiesComponent } from './components/recipies/recipies.component';
import { PlannerComponent } from './planner.component';

@NgModule({
  imports: [
    CommonModule,
    RecipiesModule,
    CalendarModule,
    SharedModule,
    FormsModule
  ],
  declarations: [PlannerComponent, RecipiesComponent]
})
export class PlannerModule { }
