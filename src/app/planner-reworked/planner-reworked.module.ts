import { MyShoppingListComponent } from './components/my-shopping-list/my-shopping-list.component';
import { AddListItemDialogComponent } from './components/add-list-item-dialog/add-list-item-dialog.component';
import { FormsModule } from '@angular/forms';
import { AddListDialogComponent } from './components/add-list-dialog/add-list-dialog.component';
import { FiltersModule } from './../filters/filters.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RecipiesPannelComponent } from './components/recipies-pannel/recipies-pannel.component';
import { RecipiesModule } from './../recipies/recipies.module';
import { CalendarModule } from './../calendar/calendar.module';
import { PrepsComponent } from './components/preps/preps.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { PlanningComponent } from './components/planning/planning.component';
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
    SharedModule,
    CalendarModule,
    RecipiesModule,
    DragDropModule,
    FiltersModule,
    FormsModule
  ],
  declarations: [
    PlannerByDateRangeComponent,
    PlannerLandingComponent,
    PlanningComponent,
    ShoppingComponent,
    PrepsComponent,
    RecipiesPannelComponent,
    AddListDialogComponent,
    AddListItemDialogComponent,
    MyShoppingListComponent
  ],
})
export class PlannerReworkedModule {}
