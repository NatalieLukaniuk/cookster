import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { User } from 'src/app/auth/models/user.interface';

import { Product } from 'src/app/recipies/models/products.interface';
import { Suggestion, SuggestionList } from '../../preps.models';
import * as UserActions from '../../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { RecipiesService } from 'src/app/recipies/services/recipies.service';
import { IAppState } from 'src/app/store/reducers';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';

@Component({
  selector: 'app-saved-preps',
  templateUrl: './saved-preps.component.html',
  styleUrls: ['./saved-preps.component.scss'],
})
export class SavedPrepsComponent implements OnChanges, OnDestroy {
  @Input() currentUser: User | null | undefined;
  @Input() allProducts!: Product[] | null;
  prepDate: any | undefined;
  lists: SuggestionList[] = [];

  listsChanged$ = new Subject();
  destroy$ = new Subject();
  constructor(
    private store: Store<IAppState>,
    private recipiesService: RecipiesService
  ) {
    this.listsChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.saveLists();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentUser && this.currentUser?.prepLists) {
      this.lists = _.cloneDeep(this.currentUser.prepLists);

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

  createPrepList(event: any) {
    let newList = new SuggestionList(event);
    this.lists.push(newList);
    this.listsChanged$.next();
  }

  saveLists() {
    if (this.currentUser) {
      let updatedUser: User = {
        ...this.currentUser,
        prepLists: this.lists,
      };
      this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }
  }

  deleteList(list: SuggestionList) {
    this.lists = this.lists.filter((item) => item.date !== list.date);
    this.listsChanged$.next();
  }

  drop(event: CdkDragDrop<Suggestion[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
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
}
