import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/auth/models/user.interface';

import { ComplexityDescription } from '../../models/complexity.enum';
import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';
import { UserService } from './../../../auth/services/user.service';

@Component({
  selector: 'app-recipy-short-view',
  templateUrl: './recipy-short-view.component.html',
  styleUrls: ['./recipy-short-view.component.scss'],
})
export class RecipyShortViewComponent implements OnInit {
  @Input()
  recipy!: Recipy;
  @Input()
  currentUser!: User;
  currentPath: string;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private recipiesService: RecipiesService,
    private userService: UserService
  ) {
    const path = window.location.pathname.split('/');
    this.currentPath = path[path.length - 1];
  }

  ngOnInit() {
  }
  goFullRecipy() {
    this.router.navigate(['full-recipy/', this.recipy.id], {
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
    return this.recipy.author == this.currentUser.email   
  }

  get author(){
    return this.recipiesService.getRecipyBelongsTo(this.recipy)
  }

  get createdOn(){
    return this.recipiesService.getRecipyCreatedOn(this.recipy)
  }
}
