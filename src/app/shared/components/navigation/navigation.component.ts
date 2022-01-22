import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { Recipy } from 'src/app/recipies/models/recipy.interface';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

import { AddRecipyComponent } from './../../../recipies/components/add-recipy/add-recipy.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  navigation = [
    // { path: 'extended-search', name: 'Розширений пошук' },
    { path: 'user-recipies', name: 'Мої рецепти' },
    // { path: 'friends-feed', name: 'Стрічка друзів' },
    // { path: 'shopping-list', name: 'Список покупок' },
    // { path: 'user-menus', name: 'Мої меню' },
  ];

  constructor(
    public dialog: MatDialog,
    private recipiesService: RecipiesService
  ) {}

  addRecipy() {
    const dialogRef = this.dialog.open(AddRecipyComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      position: { bottom: '0' },
      hasBackdrop: false,
      panelClass: 'full-recipy-dialog',
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: Recipy) => {
        this.recipiesService.processAddNewRecipy(result);
      });
  }
}
