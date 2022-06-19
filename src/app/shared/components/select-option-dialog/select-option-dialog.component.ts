import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  mealOptions: string[];  
}

@Component({
  selector: 'app-select-option-dialog',
  templateUrl: './select-option-dialog.component.html',
  styleUrls: ['./select-option-dialog.component.scss']
})
export class SelectOptionDialogComponent implements OnInit {

  selectedOption: string = this.data.mealOptions[0]
  portionsOptions: number[] = [1,2,3,4,5,6,7,8,9] //TODO needs refactoring - the options are hardcoded
  selectedPortionOption: number = this.portionsOptions[3]
  amountPerPortion: number = 250;

  constructor(public dialogRef: MatDialogRef<SelectOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
