import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { IAppState } from 'src/app/store/reducers';

import * as UserActions from '../../store/actions/user.actions';
import { ShoppingListItem } from '../models';
import { User } from './../../auth/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  constructor(private store: Store<IAppState>) {}

  addList(currentUser: User, listToSave: ShoppingListItem) {
    let _currentUser = _.cloneDeep(currentUser);
    if (!('shoppingLists' in _currentUser) || !_currentUser.shoppingLists) {
      _currentUser.shoppingLists = [];
    }
    if ('shoppingLists' in _currentUser) {
      let listExists: ShoppingListItem | undefined;
      if ('recipyId' in listToSave && 'day' in listToSave && 'meal' in listToSave) {
        listExists = _currentUser.shoppingLists!.find(
          (item) =>
            item.recipyId == listToSave.recipyId && item.day == listToSave.day && item.meal == listToSave.meal
        );
      } else if ('recipyId' in listToSave && !('day' in listToSave)) {
        listExists = _currentUser.shoppingLists!.find(
          (item) => item.recipyId == listToSave.recipyId && !('day' in item)
        );
      } else if ('listName' in listToSave) {
        listExists = _currentUser.shoppingLists!.find(
          (item) => item.listName == listToSave.listName
        );
      }
      if (!!listExists) {
        //if list exists, decide what to do )
      } else {
        _currentUser.shoppingLists!.push(listToSave);
      }
      this.store.dispatch(new UserActions.UpdateUserAction(_currentUser));
    }
  }

  removeShoppingLists(currentUser: User){
    let _currentUser = _.cloneDeep(currentUser);
    _currentUser.shoppingLists = [];
    this.store.dispatch(new UserActions.UpdateUserAction(_currentUser));
  }
}
