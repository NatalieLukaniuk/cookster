import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/auth/models/user.interface';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';

import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';
import { AppMode } from './../../containers/edit-recipy/edit-recipy.component';

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
  @Input()
  isMobile!: boolean;
  @Input() isPlanner = false;
  @Input() mode: AppMode = AppMode.Planner;
  AppMode = AppMode;
  currentPath: string;
  showNeedsAdvancePreparation: boolean = false;
  @Output() addToCalendar = new EventEmitter<Recipy>();
  @Output() recipyClicked = new EventEmitter<Recipy>();

  isRecipyClicked: boolean = false;
  isHovered: boolean = false;
  isDetailedInfo: boolean = false;

  hasPrepSuggestions: boolean = false;

  ingredientsToSkip = ['-Mu5TNCG6N8Q_nwkPmNb', '-Mu5UmO24kMVyKveKjah', '-MuzaMFzts_yzcBtPRyt', '-Muzb3OfJhqdsrleyz2a']
  constructor(
    public dialog: MatDialog,
    private recipiesService: RecipiesService,
  ) {
    const path = window.location.pathname.split('/');
    this.currentPath = path[path.length - 1];
  }

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(DishType['потребує попередньої підготовки']);
    this.hasPrepSuggestions = !!this.recipy.ingrediends.find(ingr => !!ingr.prep)
  }
  goFullRecipy() {
    this.recipyClicked.emit(this.recipy)
  }

  get complexity() {
    return ComplexityDescription[this.recipy.complexity];
  }

  get preparationTime() {
    let time = 0;
    for (let step of this.recipy.steps) {
      time = time + +step.timeActive + +step.timePassive;
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

  onAddToCalendar(){
    this.addToCalendar.emit(this.recipy);
  }

  getIngredientText(ingredient: Ingredient): string {
    return this.recipiesService.getIngredientText(ingredient);
  }

  get tags() {
    let tags: string[] = [];
    if (this.recipy) {
      this.recipy.type.forEach((tag: DishType) => {
        tags.push(DishType[tag]);
      });
    }
    return tags;
  }

  onRecipyClicked(){
    if(!this.isMobile){
      this.isRecipyClicked = !this.isRecipyClicked;
    }else if(this.isMobile && !this.isRecipyClicked && !this.isDetailedInfo){
      this.isRecipyClicked = true
    } else if(this.isMobile && this.isRecipyClicked && !this.isDetailedInfo){
      this.isRecipyClicked = false
      this.isDetailedInfo = true
    } else if(this.isMobile && this.isDetailedInfo){
      this.isDetailedInfo = false;
    }
  }

  get topIngredients(){
    let sorted = this.recipy.ingrediends.map(ingr => ingr).sort((a, b) => b.amount - a.amount );
    sorted = sorted.filter(ingr => !this.ingredientsToSkip.includes(ingr.product))
    if(sorted.length >= 6){
      sorted.splice(5)
    }
    return sorted
  }
}
