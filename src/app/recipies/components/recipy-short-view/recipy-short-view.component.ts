import {
  CreateRecipyCollection,
  UpdateUserAction,
} from './../../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/auth/models/user.interface';
import { Ingredient } from 'src/app/recipies/models/ingredient.interface';
import { InputDialogComponent } from 'src/app/shared/components/input-dialog/input-dialog.component';

import { ComplexityDescription } from '../../models/complexity.enum';
import { DishType } from '../../models/dishType.enum';
import { Recipy } from '../../models/recipy.interface';
import { RecipiesService } from '../../services/recipies.service';
import { AppMode } from './../../containers/edit-recipy/edit-recipy.component';
import { IAppState } from 'src/app/store/reducers';
import * as _ from 'lodash';

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

  ingredientsToSkip = [
    '-Mu5TNCG6N8Q_nwkPmNb',
    '-Mu5UmO24kMVyKveKjah',
    '-MuzaMFzts_yzcBtPRyt',
    '-Muzb3OfJhqdsrleyz2a',
  ];
  constructor(
    public dialog: MatDialog,
    private recipiesService: RecipiesService,
    private store: Store<IAppState>
  ) {
    const path = window.location.pathname.split('/');
    this.currentPath = path[path.length - 1];
  }

  ngOnInit() {
    this.showNeedsAdvancePreparation = this.recipy.type.includes(
      DishType['потребує попередньої підготовки']
    );
    this.hasPrepSuggestions = !!this.recipy.ingrediends.find(
      (ingr) => !!ingr.prep
    );
  }
  goFullRecipy() {
    this.recipyClicked.emit(this.recipy);
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

  get isUserRecipy() {
    return this.recipy.author == this.currentUser.email;
  }

  get author() {
    return this.recipiesService.getRecipyBelongsTo(this.recipy);
  }

  get createdOn() {
    return this.recipiesService.getRecipyCreatedOn(this.recipy);
  }

  get recipyCollections() {
    if (this.currentUser.collections) {
      return this.currentUser.collections.map((collection) => {
        if (collection.recipies?.includes(this.recipy.id)) {
          return '✓ ' + collection.name;
        } else return '+ ' + collection.name;
      });
    } else return [];
  }

  onCollectionSelected(collection: string) {
    let split = collection.split(' ');
    let cleanedName = split[split.length - 1];
    let updated = _.cloneDeep(this.currentUser);
    updated.collections = updated.collections!.map((coll) => {
      if (coll.name === cleanedName) {
        if (coll.recipies && coll.recipies.includes(this.recipy.id)) {
          coll.recipies = coll.recipies.filter((id) => id !== this.recipy.id);
        } else if (coll.recipies && !coll.recipies.includes(this.recipy.id)) {
          coll.recipies.push(this.recipy.id);
        } else {
          coll.recipies = [this.recipy.id];
        }
        return coll;
      } else return coll;
    });
    this.store.dispatch(new UpdateUserAction(updated));
  }

  addCollection() {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      data: [{ title: 'Назва колекції', key: '' }],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(new CreateRecipyCollection(result[0].key));
    });
  }

  onAddToCalendar() {
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

  onRecipyClicked() {
    if (!this.isMobile) {
      this.isRecipyClicked = !this.isRecipyClicked;
    } else if (this.isMobile && !this.isRecipyClicked && !this.isDetailedInfo) {
      this.isRecipyClicked = true;
    } else if (this.isMobile && this.isRecipyClicked && !this.isDetailedInfo) {
      this.isRecipyClicked = false;
      this.isDetailedInfo = true;
    } else if (this.isMobile && this.isDetailedInfo) {
      this.isDetailedInfo = false;
    }
  }

  get topIngredients() {
    let sorted = this.recipy.ingrediends
      .map((ingr) => ingr)
      .sort((a, b) => b.amount - a.amount);
    sorted = sorted.filter(
      (ingr) => !this.ingredientsToSkip.includes(ingr.product)
    );
    if (sorted.length >= 6) {
      sorted.splice(5);
    }
    return sorted;
  }
}
