import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CooksterModule } from './cookster/cookster.module';
import { FiltersModule } from './filters/filters.module';
import { LayoutModule } from './layout/layout.module';
import { MenusModule } from './menus/menus.module';
import { RecipiesModule } from './recipies/recipies.module';
import { SharedModule } from './shared/shared.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
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
    MenusModule,
    AdminModule,
    CooksterModule,
    AuthModule,
    FiltersModule,
    FlexLayoutModule,
    ShoppingListModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([RecipiesEffects, UserEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
