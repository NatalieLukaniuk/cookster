import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SuggestionList } from 'src/app/planner/components/advance-preparation/advance-preparation.component';
import { getCurrentUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-prep-lists',
  templateUrl: './prep-lists.component.html',
  styleUrls: ['./prep-lists.component.scss']
})
export class PrepListsComponent implements OnInit {

  prepLists: SuggestionList[]  = [];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.pipe(select(getCurrentUser)).subscribe(res => {
      if(res && res.prepLists){
        this.prepLists = res.prepLists;
      }
    })
  }

}
