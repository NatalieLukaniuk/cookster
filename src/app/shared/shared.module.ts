import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SelectOptionDialogComponent } from './components/select-option-dialog/select-option-dialog.component';
import { HeaderComponent } from './containers/header/header.component';
import { NormalizeTimePipe } from './pipes/normalize-time.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    MatSortModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSliderModule,
    MatBottomSheetModule,
    MatTabsModule,
    MatTooltipModule
  ],
  declarations: [
    HeaderComponent,
    NavigationComponent,
    SelectOptionDialogComponent,
    NormalizeTimePipe,
    
  ],
  exports: [
    HeaderComponent,
    MatButtonModule,
    NavigationComponent,
    MatSidenavModule,
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
    MatSortModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSliderModule,
    SelectOptionDialogComponent,
    MatBottomSheetModule,
    MatTabsModule,
    NormalizeTimePipe,
    MatTooltipModule,
    
  ],
  providers: []
})
export class SharedModule {}
