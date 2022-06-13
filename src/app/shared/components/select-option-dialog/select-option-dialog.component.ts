import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  options: string[];
}

@Component({
  selector: 'app-select-option-dialog',
  templateUrl: './select-option-dialog.component.html',
  styleUrls: ['./select-option-dialog.component.scss']
})
export class SelectOptionDialogComponent implements OnInit {

  selectedOption: string = this.data.options[0]

  constructor(public dialogRef: MatDialogRef<SelectOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
