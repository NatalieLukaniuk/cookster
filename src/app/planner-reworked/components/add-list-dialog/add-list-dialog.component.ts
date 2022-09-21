import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-list-dialog',
  templateUrl: './add-list-dialog.component.html',
  styleUrls: ['./add-list-dialog.component.scss']
})
export class AddListDialogComponent implements OnInit {
  name: string = '';
  constructor(public dialogRef: MatDialogRef<AddListDialogComponent>,) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
