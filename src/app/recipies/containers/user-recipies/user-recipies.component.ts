import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';
import { LayoutService } from './../../../shared/services/layout.service';

@Component({
  selector: 'app-user-recipies',
  templateUrl: './user-recipies.component.html',
  styleUrls: ['./user-recipies.component.scss'],
})
export class UserRecipiesComponent implements OnInit, OnDestroy {
  userRecipies: Recipy[] = [];
  isMobile: boolean = false;
  destroy$ = new Subject();
  constructor(
    private recipies: RecipiesService,
    private layoutService: LayoutService
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit() {
    this.recipies.newRecipyAdded.subscribe(() => this.recipies.getRecipies());
    this.recipies.userRecipies$.subscribe(recipies => {
      this.userRecipies = recipies;
    })
    this.layoutService.isMobile$.pipe(takeUntil(this.destroy$)).subscribe(bool => this.isMobile = bool)
  }

}
