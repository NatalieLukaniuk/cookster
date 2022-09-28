import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.interface';
import { Product } from 'src/app/recipies/models/products.interface';
import { IAppState } from 'src/app/store/reducers';
import { Suggestion, SuggestionList } from '../../preps.models';
import * as UserActions from '../../../store/actions/user.actions';
import * as _ from 'lodash';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { areArraysEqual } from 'src/app/shared/utils/comparison';

@Component({
  selector: 'app-saved-scenarios',
  templateUrl: './saved-scenarios.component.html',
  styleUrls: ['./saved-scenarios.component.scss']
})
export class SavedScenariosComponent implements OnChanges, OnDestroy {
  @Input() currentUser: User | null | undefined;
  @Input() allProducts!: Product[] | null;
  prepDate: any | undefined;
  lists: SuggestionList[] = [];

  listsChanged$ = new Subject();
  destroy$ = new Subject();
  constructor(private store: Store<IAppState>,) {
    this.listsChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveLists();
    });
   }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentUser && this.currentUser?.scenarios) {
      this.lists = _.cloneDeep(this.currentUser.scenarios);

      this.lists = this.lists.map((list) => {
        if (!list.suggestions) {
          return {
            ...list,
            suggestions: [],
          };
        } else return list;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  createPrepList(event: any) {
    let newList = new SuggestionList(event);
    this.lists.push(newList);
    this.listsChanged$.next();
  }

  saveLists() {
    if (this.currentUser) {
      let updatedUser: User = {
        ...this.currentUser,
        scenarios: this.lists,
      };
      this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }
  }

  drop(event: CdkDragDrop<Suggestion[]>) {
    console.log(event.item.element.nativeElement.childNodes[0].textContent)
    let steptext = event.item.element.nativeElement.childNodes[0].textContent;

  }

  deleteList(list: SuggestionList) {
    this.lists = this.lists.filter((item) => item.date !== list.date);
    this.listsChanged$.next();
  }

  onRemoveItem(event: Suggestion, list: SuggestionList) {
    this.lists = this.lists.map((el) => {
      if (el.date == list.date) {
        return {
          ...el,
          suggestions: el.suggestions.filter(
            (sugg) => sugg.prepDescription !== event.prepDescription
          ),
        };
      } else return el;
    });
    this.listsChanged$.next();
  }

  onTimeChanged(suggestion: Suggestion, i: number) {
    this.lists[i].suggestions = this.lists[i].suggestions.map((sugg) => {
      if (
        areArraysEqual(sugg.ingredients, suggestion.ingredients)
        &&
        sugg.prepDescription == suggestion.prepDescription
      ) {
        return suggestion;
      } else return sugg;
    });
    this.listsChanged$.next();
  }

}
