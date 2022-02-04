import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AddEditRecipyComponent } from 'src/app/recipies/components/add-edit-recipy/add-edit-recipy.component';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';

import { LayoutService } from '../../services/layout.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnDestroy {
  navigation = [
    // { path: 'extended-search', name: 'Розширений пошук' },
    { path: 'recipies/user-recipies', name: 'Мої рецепти' },
    // { path: 'friends-feed', name: 'Стрічка друзів' },
    // { path: 'shopping-list', name: 'Список покупок' },
    // { path: 'user-menus', name: 'Мої меню' },
  ];

  mobileNavigation = [
    { path: 'cookster/recipies/user-recipies', name: 'Мої рецепти' },
  ]

  isMobile: boolean = false;
  destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private recipiesService: RecipiesService,
    private layoutService: LayoutService,
  ) {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  addRecipy() {
    const dialogRef = this.dialog.open(AddEditRecipyComponent, {
      width: '90%',
      maxWidth: '100%',
      height: '80%',
      // position: { bottom: '0' },
      hasBackdrop: false,
      panelClass: 'add-recipy-dialog',
      autoFocus: false,
      data: {
        mode: 'create'
      }
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: any) => {
        this.recipiesService.processAddNewRecipy(result.recipy, result.mode);
      });
  }
}
