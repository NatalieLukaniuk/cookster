import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
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
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatTreeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
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
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatTreeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: []
})
export class SharedModule {}
