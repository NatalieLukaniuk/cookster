import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { FiltersModule } from './../filters/filters.module';
import { RecipiesModule } from './../recipies/recipies.module';
import { CalendarRecipyComponent } from './components/calendar-recipy/calendar-recipy.component';
import { CalendarSelectorComponent } from './components/calendar-selector/calendar-selector.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DayComponent } from './components/day/day.component';
import {
  IngredientsToListBottomsheetComponent,
} from './components/ingredients-to-list-bottomsheet/ingredients-to-list-bottomsheet.component';
import { RecipiesBottomsheetComponent } from './components/recipies-bottomsheet/recipies-bottomsheet.component';
import { CalendarContainerComponent } from './containers/calendar-container/calendar-container.component';
import { MenusComponent } from './menus.component';
import { MomentPipe } from './pipes/moment.pipe';

@NgModule({
  imports: [CommonModule, SharedModule, FiltersModule, FormsModule, RecipiesModule],
  declarations: [
    MenusComponent,
    CalendarComponent,
    CalendarContainerComponent,
    CalendarSelectorComponent,
    MomentPipe,
    DayComponent,
    CalendarRecipyComponent,
    RecipiesBottomsheetComponent,
    IngredientsToListBottomsheetComponent,
  ],
})
export class MenusModule {}
