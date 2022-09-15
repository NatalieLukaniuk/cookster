import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlannerByDateRangeComponent } from './containers/planner-by-date-range/planner-by-date-range.component';
import { PlannerLandingComponent } from './containers/planner-landing/planner-landing.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  declarations: [PlannerByDateRangeComponent, PlannerLandingComponent]
})
export class PlannerReworkedModule { }
