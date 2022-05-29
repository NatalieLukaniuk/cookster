import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CooksterModule } from './cookster/cookster.module';
import { LayoutModule } from './layout/layout.module';
import { MenusModule } from './menus/menus.module';
import { RecipiesModule } from './recipies/recipies.module';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { RecipiesEffects } from './store/effects/recipies.effects';

 

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
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([RecipiesEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
