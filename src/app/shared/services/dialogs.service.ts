import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { SelectOptionDialogComponent } from '../components/select-option-dialog/select-option-dialog.component';
import { TextInputDialogComponent } from './../components/text-input-dialog/text-input-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  constructor(public dialog: MatDialog) {}

  openMealTimeSelectionDialog(): Observable<{
    meal: string;
    portions: number;
    amountPerPortion: number;
  }> {
    return new Observable((observer) => {
      const dialogRef = this.dialog.open(SelectOptionDialogComponent, {
        width: '320px',
        maxWidth: '99vw',
        data: { title: '', mealOptions: ['breakfast', 'lunch', 'dinner'] },
      });

      dialogRef
        .afterClosed()
        .subscribe(
          (
            result:
              | { meal: string; portions: number; amountPerPortion: number }
              | undefined
          ) => {
            observer.next(result);
            observer.complete();
          }
        );
    });
  }

  openPortionsDialog(): Observable<{
    portions: number;
    amountPerPortion: number;
  }> {
    return new Observable((observer) => {
      const dialogRef = this.dialog.open(SelectOptionDialogComponent, {
        width: '320px',
        maxWidth: '99vw',
        data: { title: '' },
      });

      dialogRef
        .afterClosed()
        .subscribe(
          (
            result:
              | { meal: string; portions: number; amountPerPortion: number }
              | undefined
          ) => {
            if (result) {
              observer.next({
                portions: result.portions,
                amountPerPortion: result.amountPerPortion,
              });
            }

            observer.complete();
          }
        );
    });
  }

  openTextInputDialog(title: string): Observable<string> {
    return new Observable((observer) => {
      const dialogRef = this.dialog.open(TextInputDialogComponent, {
        width: '320px',
        maxWidth: '99vw',
        data: { title: title },
      });
      dialogRef.afterClosed().subscribe((res: string) => {
        if (res) {
          observer.next(res);
        }
        observer.complete();
      });
    });
  }

  openAddPrepInstructionsDialog(): Observable<string>{
    return this.openTextInputDialog('Додайте інструкції з попереднього підготування')
  }
}
