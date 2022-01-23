import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CooksterModule } from './cookster/cookster.module';
import { LayoutModule } from './layout/layout.module';
import { MenusModule } from './menus/menus.module';
import { RecipiesModule } from './recipies/recipies.module';
import { SharedModule } from './shared/shared.module';

 

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
    CooksterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
