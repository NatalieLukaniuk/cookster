import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.layoutService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((bool) => (this.isMobile = bool));
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  onAddRecipy(){
    if(!this.isMobile){
      this.router.navigate(['recipies', 'edit-recipy'], { relativeTo: this.route })
    } else {this.router.navigate(['cookster','recipies', 'edit-recipy'], { relativeTo: this.route })}
   }
}
