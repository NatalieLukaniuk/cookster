import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { getAllRecipies } from 'src/app/store/selectors/recipies.selectors';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';

@Component({
  selector: 'app-all-recipies',
  templateUrl: './all-recipies.component.html',
  styleUrls: ['./all-recipies.component.scss']
})
export class AllRecipiesComponent implements OnInit {

  allRecipies: Recipy[] | undefined;
  isMobile: boolean = false;
  currentUser: User | undefined;
  destroy$ = new Subject();
  constructor(
    private recipies: RecipiesService,
    private layoutService: LayoutService,
    private store: Store
  ) {
    this.store.pipe(select(getAllRecipies)).subscribe((res: Recipy[]) => {
      if(!!res){        
        this.allRecipies = res;
        console.log(this.allRecipies)
      }
    });
    this.store.pipe(select(getCurrentUser)).subscribe((res: any) => {
      if (!!res){
        this.currentUser = res;
      }
    })
  }
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit() {
    this.layoutService.isMobile$.pipe(takeUntil(this.destroy$)).subscribe(bool => this.isMobile = bool)
  }

}
