import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

import { ComplexityDescription } from '../../models/complexity.enum';
import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';

@Component({
  selector: 'app-recipy-short-view',
  templateUrl: './recipy-short-view.component.html',
  styleUrls: ['./recipy-short-view.component.scss'],
})
export class RecipyShortViewComponent implements OnInit {
  @Input()
  recipy!: Recipy;
  currentPath: string;
  isUserLoaded: boolean = false;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private recipiesService: RecipiesService
  ) {
    const path = window.location.pathname.split('/');
    this.currentPath = path[path.length - 1];
  }

  ngOnInit() {
    if(this.authService.userDetailsFromMyDatabase){
      this.isUserLoaded = true;
    }
  }
  goFullRecipy(id: string | undefined) {
    this.router.navigate(['full-recipy/', id], {
      relativeTo: this.route.parent,
    });
  }

  get complexity() {
    return ComplexityDescription[this.recipy.complexity];
  }

  get preparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + step.timeActive + step.timePassive;
    }
    return time;
  }

  get isUserRecipy(){
    if(this.authService.userDetailsFromMyDatabase.recipies){
      return this.authService.userDetailsFromMyDatabase.recipies.includes(this.recipy.id)
    } else return false    
  }

  addToUserRecipies(){
    this.recipiesService.addRecipyToUserRecipies(this.recipy.id)
  }

  removeFromUserRecipies(){
    this.recipiesService.removeRecipyFromUserRecipies(this.recipy.id)
  }
}
