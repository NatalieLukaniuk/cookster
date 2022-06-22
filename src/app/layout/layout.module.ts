import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FriendsFeedComponent } from './containers/friends-feed/friends-feed.component';
import { MainLayoutComponent } from './containers/main-layout/main-layout.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MainLayoutComponent, FriendsFeedComponent],
})
export class LayoutModule {}
