import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CalendarSelectorComponent } from './components/calendar-selector/calendar-selector.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarContainerComponent } from './containers/calendar-container/calendar-container.component';
import { MenusComponent } from './menus.component';
import { MomentPipe } from './pipes/moment.pipe';
import { DayComponent } from './components/day/day.component';
import { CalendarRecipyComponent } from './components/calendar-recipy/calendar-recipy.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    MenusComponent,
    CalendarComponent,
    CalendarContainerComponent,
    CalendarSelectorComponent,
    MomentPipe,
    DayComponent,
    CalendarRecipyComponent,
  ],
})
export class MenusModule {}
