import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './containers/header/header.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import { MyDatePickerModule } from 'mydatepicker';
import { SelectOptionDialogComponent } from './components/select-option-dialog/select-option-dialog.component';
import { FormsModule } from '@angular/forms';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';


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
    MyDatePickerModule,
    MatBottomSheetModule
  ],
  declarations: [
    HeaderComponent,
    NavigationComponent,
    SelectOptionDialogComponent,
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
    MyDatePickerModule,
    SelectOptionDialogComponent,
    MatBottomSheetModule
  ],
  providers: []
})
export class SharedModule {}
