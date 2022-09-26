import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FiltersModule } from '../filters/filters.module';
import { RecipiesModule } from '../recipies/recipies.module';
import { SharedModule } from '../shared/shared.module';
import { CalendarByMonthComponent } from './components/calendar-by-month/calendar-by-month.component';
import { CalendarRecipyComponent } from './components/calendar-recipy/calendar-recipy.component';
import { CalendarSelectorComponent } from './components/calendar-selector/calendar-selector.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CelandarMealComponent } from './components/celandar-meal/celandar-meal.component';
import { DayComponent } from './components/day/day.component';
import {
  BottomsheetIngredientComponent,
} from './components/ingredients-to-list-bottomsheet/bottomsheet-ingredient/bottomsheet-ingredient.component';
import {
  IngredientsToListBottomsheetComponent,
} from './components/ingredients-to-list-bottomsheet/ingredients-to-list-bottomsheet.component';
import { RecipiesBottomsheetComponent } from './components/recipies-bottomsheet/recipies-bottomsheet.component';
import { CalendarByDayComponent } from './containers/calendar-by-day/calendar-by-day.component';
import { CalendarContainerComponent } from './containers/calendar-container/calendar-container.component';
import { MomentPipe } from './pipes/moment.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FiltersModule,
    FormsModule,
    RecipiesModule,
    DragDropModule,
    ReactiveFormsModule 
  ],
  declarations: [
    CalendarComponent,
    CalendarContainerComponent,
    CalendarSelectorComponent,
    MomentPipe,
    DayComponent,
    CalendarRecipyComponent,
    RecipiesBottomsheetComponent,
    IngredientsToListBottomsheetComponent,
    CalendarByMonthComponent,
    BottomsheetIngredientComponent,
    CelandarMealComponent,
    CalendarByDayComponent
  ],
  exports: [CalendarContainerComponent, CalendarByMonthComponent, CalendarByDayComponent],
})
export class CalendarModule {}
