import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

import { ExtendedSearchComponent } from './components/extended-search/extended-search.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { SearchComponent } from './components/search/search.component';
import { HeaderComponent } from './containers/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule
  ],
  declarations: [
    HeaderComponent,
    NavigationComponent,
    SearchComponent,
    ExtendedSearchComponent,
  ],
  exports: [
    HeaderComponent,
    MatButtonModule,
    NavigationComponent,
    SearchComponent,
    MatSidenavModule,
    ExtendedSearchComponent,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule
  ],
  providers: []
})
export class SharedModule {}
