import { take } from 'rxjs/operators';
import { Day } from 'src/app/calendar/components/calendar/calendar.component';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { User } from 'src/app/auth/models/user.interface';
import { SuggestionList, SuggestionCard, Suggestion } from 'src/app/planner-reworked/preps.models';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

import * as UserActions from '../../../store/actions/user.actions';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-prep-lists',
  templateUrl: './prep-lists.component.html',
  styleUrls: ['./prep-lists.component.scss']
})
export class PrepListsComponent implements OnChanges {
  @Input()
  day!: Day;
  prepListItems: SuggestionCard[] = [];

  currentUser: User | undefined;
  @Output() hasTimedOutPreps = new EventEmitter()

  constructor(private store: Store) { 
    this.store.pipe(select(getCurrentUser)).subscribe(res => {
      if(res){
        this.currentUser = res;  
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.day.currentValue){
      this.buildPrepList()      
    }
  }

  buildPrepList(){
    this.prepListItems = [];
    if(this.currentUser && this.currentUser.prepLists?.length){
      let found = this.currentUser.prepLists.find((list: SuggestionList) => list.date == this.day.details.day);
      if(found){
        this.prepListItems = found.suggestions.map(suggestion => new SuggestionCard(suggestion))
      }
    }
    this.checkTimePassed()
  }
  
  

  onClickSuggestion(suggestion: SuggestionCard){
    suggestion.done = !suggestion.done;
    this.checkTimePassed()
  }

  hasDoneItems(): boolean{
    return !!this.prepListItems?.find(suggestion => suggestion.done)
  }

  saveChanges(){
    if(this.currentUser && this.currentUser.prepLists){
       let updatedUser = _.cloneDeep(this.currentUser);
       updatedUser.prepLists = updatedUser.prepLists!.map(list => {
        if(list.date == this.day.details.day){
          debugger
          return {...list, suggestions: this.prepListItems.filter(sugg => !sugg.done)}
        } else return list
       })
       this.store.dispatch(new UserActions.UpdateUserAction(updatedUser));
    }

  }

  hasIncomplete(){
    return !!this.prepListItems?.find(suggestion => !(suggestion.done))
  }

  isTimePassed(suggestion: Suggestion){
    if(suggestion.time){
      let currentDay = moment();
      if(currentDay.isBefore(this.day.value, 'date')){
        return false
      } else if(currentDay.isAfter(this.day.value, 'date')){
        return true
      } else {
        let timeNow = moment().hour().toString() + moment().minutes().toString()
        let formattedSuggestionTime = suggestion.time.split(':')[0] + suggestion.time.split(':')[1]
        return +timeNow > +formattedSuggestionTime
      }
    } else return false
  }

  checkTimePassed(){
    let hasPassed = !!this.prepListItems.find(sugg => this.isTimePassed(sugg) && !sugg.done)
    this.hasTimedOutPreps.emit(hasPassed)
  }

}
