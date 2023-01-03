import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-list-item-dialog',
  templateUrl: './add-list-item-dialog.component.html',
  styleUrls: ['./add-list-item-dialog.component.scss'],
})
export class AddListItemDialogComponent implements OnInit {
  name: string = '';
  amount: string = '';
  comment: string = '';
  constructor(public dialogRef: MatDialogRef<AddListItemDialogComponent>) {}

  ngOnInit() {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
