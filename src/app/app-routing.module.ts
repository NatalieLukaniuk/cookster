import { ActiveShoppingListComponent } from './planner-reworked/containers/active-shopping-list/active-shopping-list.component';
import { PrepsComponent } from './planner-reworked/components/preps/preps.component';
import { ShoppingComponent } from './planner-reworked/components/shopping/shopping.component';
import { PlanningComponent } from './planner-reworked/components/planning/planning.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { SplashComponent } from './auth/components/splash/splash.component';
import { CalendarContainerComponent } from './calendar/containers/calendar-container/calendar-container.component';
import { CooksterComponent } from './cookster/cookster.component';
import { FriendsFeedComponent } from './layout/containers/friends-feed/friends-feed.component';
import {
  PlannerByDateRangeComponent,
} from './planner-reworked/containers/planner-by-date-range/planner-by-date-range.component';
import { PlannerLandingComponent } from './planner-reworked/containers/planner-landing/planner-landing.component';
import { PrepListsComponent } from './planner/containers/prep-lists/prep-lists.component';
import { PlannerComponent } from './planner/planner.component';
import { AllRecipiesComponent } from './recipies/containers/all-recipies/all-recipies.component';
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
          {
            path: 'all-recipies',
            component: AllRecipiesComponent,
            children: [
              {
                path: 'calendar',
                component: CalendarContainerComponent,
                data: { isPlanner: true }, // TODO remove the isPlanner and the related logic, in css as well, there's no sidepane anymore
              },
            ],
          },
          { path: 'edit-recipy', component: EditRecipyComponent },
        ],
      },
      { path: 'friends-feed', component: FriendsFeedComponent },
    ],
  },
  {
    path: 'calendar-planner',
    component: PlannerComponent
  },
  {
    path: 'prep-lists',
    component: PrepListsComponent
  },
  {
    path: 'calendar',
    component: CalendarContainerComponent,
    data: { isPlanner: false },
  },
  { path: 'shopping-list', component: ActiveShoppingListComponent },
  { path: 'planner-reworked', component: PlannerLandingComponent , children: [
    {
      path: 'by-date/:id',
      component: PlannerByDateRangeComponent,
      // pathMatch: 'full',
      children: [
        {path: 'planning', component: PlanningComponent, pathMatch: 'full',},
        {path: 'shopping', component: ShoppingComponent, pathMatch: 'full',},
        {path: 'preps', component: PrepsComponent, pathMatch: 'full',}
      ]
    },
  ]},
  { path: 'admin-panel', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: SplashComponent},
  { path: 'register', component: RegistrationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
