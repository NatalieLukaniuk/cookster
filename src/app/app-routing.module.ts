import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FriendsFeedComponent } from './layout/containers/friends-feed/friends-feed.component';
import { ShoppingListComponent } from './layout/containers/shopping-list/shopping-list.component';
import { MenusComponent } from './menus/menus.component';
import { UserRecipiesComponent } from './recipies/containers/user-recipies/user-recipies.component';
import { ExtendedSearchComponent } from './shared/components/extended-search/extended-search.component';

export const routes: Routes = [
  {path: 'extended-search', component: ExtendedSearchComponent, },
  {path: 'user-recipies', component: UserRecipiesComponent},
  {path: 'friends-feed', component: FriendsFeedComponent},
  {path: 'shopping-list', component: ShoppingListComponent},
  {path: 'user-menus', component: MenusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
