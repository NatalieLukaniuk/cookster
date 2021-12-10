import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Recipy } from '../../models/recipy.interface';
import { RecipyFullViewComponent } from './../recipy-full-view/recipy-full-view.component';

@Component({
  selector: 'app-recipy-short-view',
  templateUrl: './recipy-short-view.component.html',
  styleUrls: ['./recipy-short-view.component.scss'],
})
export class RecipyShortViewComponent implements OnInit {
  @Input()
  recipy!: Recipy;
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}
  goFullRecipy() {
    const dialogRef = this.dialog.open(RecipyFullViewComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      position: { bottom: '0' },
      hasBackdrop: false,
      panelClass: 'full-recipy-dialog',
      autoFocus: false,
      data: this.recipy,
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    // });
  }
}
