import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { SelectOptionDialogComponent } from '../components/select-option-dialog/select-option-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogsService {

    constructor(public dialog: MatDialog) { }

    openMealTimeSelectionDialog(): Observable<{meal: string, portions: number, amountPerPortion: number}> {
        return new Observable(observer => {
            const dialogRef = this.dialog.open(SelectOptionDialogComponent, {
                width: '320px',
                maxWidth: '99vw',
                data: { title: 'Select meal time', mealOptions: ['breakfast', 'lunch', 'dinner'] },
            });

            dialogRef.afterClosed().subscribe((result: {meal: string, portions: number, amountPerPortion: number} | undefined) => {
                observer.next(result)
                observer.complete()
            });
        })
    }
}