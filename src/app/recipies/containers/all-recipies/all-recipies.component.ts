import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from 'src/app/shared/services/layout.service';

import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';

@Component({
  selector: 'app-all-recipies',
  templateUrl: './all-recipies.component.html',
  styleUrls: ['./all-recipies.component.scss']
})
export class AllRecipiesComponent implements OnInit {

  allRecipies: Recipy[] = [];
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
    this.recipies.allRecipies$.subscribe(recipies => {
      this.allRecipies = recipies;
    })
    this.layoutService.isMobile$.pipe(takeUntil(this.destroy$)).subscribe(bool => this.isMobile = bool)
  }

}
