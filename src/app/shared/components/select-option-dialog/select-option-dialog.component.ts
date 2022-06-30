import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AVERAGE_PORTION } from './../../constants';

export interface DialogData {
  title: string;
  mealOptions: string[];
}

@Component({
  selector: 'app-select-option-dialog',
  templateUrl: './select-option-dialog.component.html',
  styleUrls: ['./select-option-dialog.component.scss'],
})
export class SelectOptionDialogComponent implements OnInit {
  selectedOption: string = this.data.mealOptions[0];
  selectedPortionOption: number = 4;
  amountPerPortion: number = AVERAGE_PORTION;

  constructor(
    public dialogRef: MatDialogRef<SelectOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
