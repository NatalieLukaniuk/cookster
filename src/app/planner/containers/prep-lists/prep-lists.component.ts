import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { User } from 'src/app/auth/models/user.interface';
import {
  SuggestionCard,
  SuggestionList,
} from 'src/app/planner/components/advance-preparation/advance-preparation.component';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import * as UserActions from '../../../store/actions/user.actions';

@Component({
  selector: 'app-prep-lists',
  templateUrl: './prep-lists.component.html',
  styleUrls: ['./prep-lists.component.scss']
})
export class PrepListsComponent implements OnInit {

  prepLists: SuggestionList[]  = [];

  currentUser: User | undefined;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.pipe(select(getCurrentUser)).subscribe(res => {
      if(res && res.prepLists){
        this.currentUser = res;
        this.prepLists = res.prepLists.map(list => {
          return {
            ...list,
            suggestions: list.suggestions.map(suggestion => new SuggestionCard(suggestion))
          }
        });
      }
    })
  }

  onClickSuggestion(suggestion: SuggestionCard){
    suggestion.done = !suggestion.done
  }

  hasDoneItems(list: SuggestionList): boolean{
    return !!list.suggestions.find(suggestion => suggestion.done)
  }

  doneItemsAvailable(): boolean{
    return !!this.prepLists.find(list => this.hasDoneItems(list))
  }

  saveChanges(){
    let listsToSave = this.prepLists.map(list => {
      return {
        ...list,
        suggestions: list.suggestions.filter(sugg => !sugg.done)
      }
    })

    listsToSave = listsToSave.filter(list => !!list.suggestions.length)

    if(this.currentUser){
      let updatedUser = {
        ...this.currentUser,
        prepLists: listsToSave
      }
      this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }
  }

  hasIncomplete(list: SuggestionList){
    return !!list.suggestions.find(suggestion => !(suggestion.done))
  }

}
