import { AdvancePreparationModule } from './advance-preparation/advance-preparation.module';
import { PlannerEffects } from './store/effects/planner.effects';
import { UiModule } from './ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

import { environment } from '../environments/environment';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { CooksterModule } from './cookster/cookster.module';
import { FiltersModule } from './filters/filters.module';
import { LayoutModule } from './layout/layout.module';
import { PlannerReworkedModule } from './planner-reworked/planner-reworked.module';
import { PlannerModule } from './planner/planner.module';
import { RecipiesModule } from './recipies/recipies.module';
import { SharedModule } from './shared/shared.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { CalendarEffects } from './store/effects/calendar.effects';
import { RecipiesEffects } from './store/effects/recipies.effects';
import { UserEffects } from './store/effects/user.effects';
import { reducers } from './store/reducers';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    LayoutModule,
    RecipiesModule,
    HttpClientModule,
    CalendarModule,
    PlannerReworkedModule,
    AdminModule,
    CooksterModule,
    AuthModule,
    FiltersModule,
    ShoppingListModule,
    PlannerModule,
    AdvancePreparationModule,
    UiModule,
    MatNativeDateModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([RecipiesEffects, UserEffects, CalendarEffects, PlannerEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [RecipiesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
