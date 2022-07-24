import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { CalendarContainerComponent } from './calendar/containers/calendar-container/calendar-container.component';
import { CooksterComponent } from './cookster/cookster.component';
import { FriendsFeedComponent } from './layout/containers/friends-feed/friends-feed.component';
import { AllRecipiesComponent } from './recipies/containers/all-recipies/all-recipies.component';
import { CalendarPlannerComponent } from './recipies/containers/calendar-planner/calendar-planner.component';
import { EditRecipyComponent } from './recipies/containers/edit-recipy/edit-recipy.component';
import { RecipyFullViewComponent } from './recipies/containers/recipy-full-view/recipy-full-view.component';
import { UserRecipiesComponent } from './recipies/containers/user-recipies/user-recipies.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cookster' },
  {
    path: 'cookster',
    component: CooksterComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'recipies/all-recipies' },
      {
        path: 'recipies',
        children: [
          { path: 'user-recipies', component: UserRecipiesComponent },
          {
            path: 'full-recipy/:id',
            component: RecipyFullViewComponent,
            pathMatch: 'full',
          },
          { path: 'all-recipies', component: AllRecipiesComponent, children: [
            { path: 'calendar', component: CalendarContainerComponent, data: {isSidePane: true} },
          ] },
          { path: 'edit-recipy', component: EditRecipyComponent }
        ],
      },
      { path: 'friends-feed', component: FriendsFeedComponent },
      
    ],
  },
  {path: 'calendar-planner', component: CalendarPlannerComponent},
  { path: 'calendar', component: CalendarContainerComponent, data: {isSidePane: false} },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'admin-panel', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
