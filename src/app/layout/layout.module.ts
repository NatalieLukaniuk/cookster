import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FriendsFeedComponent } from './containers/friends-feed/friends-feed.component';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';
import { ShoppingListComponent } from './containers/shopping-list/shopping-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MainLayoutComponent,
    FriendsFeedComponent,
    ShoppingListComponent,
  ],
})
export class LayoutModule {}
