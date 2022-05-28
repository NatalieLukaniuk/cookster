import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { CooksterComponent } from './cookster/cookster.component';
import { FriendsFeedComponent } from './layout/containers/friends-feed/friends-feed.component';
import { ShoppingListComponent } from './layout/containers/shopping-list/shopping-list.component';
import { MenusComponent } from './menus/menus.component';
import { RecipyFullViewComponent } from './recipies/containers/recipy-full-view/recipy-full-view.component';
import { RecipyPreviewComponent } from './recipies/components/recipy-preview/recipy-preview.component';
import { AllRecipiesComponent } from './recipies/containers/all-recipies/all-recipies.component';
import { UserRecipiesComponent } from './recipies/containers/user-recipies/user-recipies.component';
import { ExtendedSearchComponent } from './shared/components/extended-search/extended-search.component';
import { EditRecipyComponent } from './recipies/containers/edit-recipy/edit-recipy.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cookster' },
  {
    path: 'cookster',
    component: CooksterComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'recipies/all-recipies' },
      { path: 'extended-search', component: ExtendedSearchComponent },
      {
        path: 'recipies',
        children: [
          { path: 'user-recipies', component: UserRecipiesComponent },
          {
            path: 'full-recipy/:id',
            component: RecipyFullViewComponent,
            pathMatch: 'full',
          },
          {path: 'all-recipies', component: AllRecipiesComponent},
          {path: 'edit-recipy', component: EditRecipyComponent}
        ],
      },
      { path: 'friends-feed', component: FriendsFeedComponent },
      { path: 'shopping-list', component: ShoppingListComponent },
      { path: 'user-menus', component: MenusComponent },
    ],
  },

  { path: 'admin-panel', component: AdminComponent },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
