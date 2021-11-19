import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SearchComponent } from './components/search/search.component';
import { HeaderComponent } from './containers/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule
  ],
  declarations: [HeaderComponent, NavigationComponent, SearchComponent],
  exports: [HeaderComponent, MatButtonModule, NavigationComponent, SearchComponent, MatSidenavModule]
})
export class SharedModule { }
