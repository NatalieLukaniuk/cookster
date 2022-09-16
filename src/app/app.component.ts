import { getCurrentUser } from 'src/app/store/selectors/user.selectors';
import { SetCurrentPlannerByDateAction } from './store/actions/planner.actions';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { throws } from 'assert';
import { initializeApp } from 'firebase/app';
import { Observable, combineLatest } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { AuthService } from './auth/services/auth.service';
import { UserService } from './auth/services/user.service';
import { RecipiesService } from './recipies/services/recipies.service';
import { LayoutService } from './shared/services/layout.service';
import * as RecipiesActions from './store/actions/recipies.actions';
import * as UiActions from './store/actions/ui.actions';
import { IAppState } from './store/reducers';
import {
  getIsError,
  getIsSidebarOpen,
  getIsSuccessMessage,
} from './store/selectors/ui.selectors';
import { User } from './auth/models/user.interface';

export enum MainTabs {
  Home = 'all-recipies',
  AddRecipy = 'edit-recipy',
  Calendar = 'calendar',
  ShoppingList = 'shopping-list',
  Preps = 'prep-lists',
}
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  firebaseConfig = {
    apiKey: 'AIzaSyAYe2tCdCuYoEPi0grZ1PkHTHgScw19LpA',
    authDomain: 'cookster-12ac8.firebaseapp.com',
    databaseURL: 'https://cookster-12ac8-default-rtdb.firebaseio.com/',
    projectId: 'cookster-12ac8',
    storageBucket: 'gs://cookster-12ac8.appspot.com/',
    messagingSenderId: '755799855022',
    appId: '1:755799855022:web:506cb5221a72eff4cf023f',
  };

  isAuthCheckPerformed$: Observable<boolean>;

  isMobile$: Observable<boolean>;

  @ViewChild('drawer')
  sidebar!: MatDrawer;

  MainTabs = MainTabs;

  currentRoute: string = '';
  routerEvents$: Observable<Event>;
  currentUser$: Observable<User | null>;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private recipiesService: RecipiesService,
    public breakpointObserver: BreakpointObserver,
    private layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private store: Store<IAppState>,
    private _snackBar: MatSnackBar
  ) {
    this.addIcons();
    const app = initializeApp(this.firebaseConfig);
    this.isAuthCheckPerformed$ = this.authService.isCheckPerformed$.pipe(
      tap((res) => console.log(res))
    );
    this.isMobile$ = this.layoutService.isMobile$;

    this.routerEvents$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    );
    this.currentUser$ = this.store.pipe(select(getCurrentUser));

    combineLatest([this.routerEvents$, this.currentUser$])
      .pipe(map((result) => ({ routerEvent: result[0], user: result[1] })))
      .subscribe((res: { routerEvent: Event; user: User | null }) => {
        if (res.routerEvent instanceof NavigationEnd) {
          const url = res.routerEvent.urlAfterRedirects.split('/');
          this.currentRoute = url[url.length - 1];
          this.store.dispatch(
            new UiActions.SetCurrentRouteAction(this.currentRoute)
          );
        }
        if (
          res.routerEvent instanceof NavigationEnd &&
          res.routerEvent.urlAfterRedirects.includes('by-date') &&
          res.user
        ) {
          const url = res.routerEvent.urlAfterRedirects.split('/');
          this.store.dispatch(new SetCurrentPlannerByDateAction(url[3]));
        }
      });
  }
  ngAfterViewInit(): void {
    this.sidebar.openedChange.subscribe((isOpen) => {
      if (!isOpen) {
        this.store.dispatch(new UiActions.SetIsSidebarOpenAction(false));
      }
    });
    this.store.pipe(select(getIsSidebarOpen)).subscribe((isOpen) => {
      if (isOpen) {
        this.sidebar.open();
      } else if (!isOpen && this.sidebar.opened) {
        this.sidebar.close();
      }
    });
  }
  ngOnInit(): void {
    const url = window.location.pathname;
    this.authService.checkIsLoggedIn();
    this.recipiesService.productsUpdated$.subscribe(() =>
      this.recipiesService.getAllProducts()
    );
    this.breakpointObserver
      .observe(['(min-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.layoutService.isMobile$.next(false);
        } else {
          this.layoutService.isMobile$.next(true);
        }
      });
    this.authService.isLoggedIn
      .pipe(untilDestroyed(this))
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.recipiesService.getAllProducts();
          this.userService.getAllUsers();
          this.router.navigate([url]);
        } else {
          this.router.navigate(['login']);
        }
      });
    this.store.dispatch(new RecipiesActions.GetRecipiesAction());
    this.store.dispatch(new RecipiesActions.LoadNewIngredientsAction());

    this.store.pipe(select(getIsError)).subscribe((error) => {
      if (!!error) {
        this._snackBar.open(error, 'Ok', {
          duration: 3000,
        });
        this.store.dispatch(new UiActions.ResetErrorAction());
      }
    });
    this.store.pipe(select(getIsSuccessMessage)).subscribe((message) => {
      if (message) {
        this._snackBar.open(message, 'Ok', {
          duration: 3000,
        });
        this.store.dispatch(new UiActions.DismissSuccessMessageAction());
      }
    });
  }

  addIcons() {
    this.iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cross.svg')
    );
    this.iconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/dots-3.svg')
    );
    this.iconRegistry.addSvgIcon(
      'heart',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/heart.svg')
    );
    this.iconRegistry.addSvgIcon(
      'add',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plus.svg')
    );
    this.iconRegistry.addSvgIcon(
      'arrow-left',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/arrow-left.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'done',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/checkmark.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'search-small',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/search.svg')
    );
    this.iconRegistry.addSvgIcon(
      'edit',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/pencil.svg')
    );
    this.iconRegistry.addSvgIcon(
      'tag',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/tag.svg')
    );
    this.iconRegistry.addSvgIcon(
      'delete',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/trash.svg')
    );
    this.iconRegistry.addSvgIcon(
      'approved',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/approved-signal-svgrepo-com.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'ingredients',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/ingredients-svgrepo-com.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'preparation',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/assets/icons/ingredients-plate-svgrepo-com.svg'
      )
    );
  }

  onMatToggleChange(event: any) {
    switch (event.value) {
      case MainTabs.Home:
        this.goHome();
        break;
      case MainTabs.AddRecipy:
        this.goAddRecipy();
        break;
      case MainTabs.Calendar:
        this.goCalendar();
        break;
      case MainTabs.ShoppingList:
        this.goShoppingLists();
        break;
      case MainTabs.Preps:
        this.goPrepLists();
    }
  }
  goHome() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
  goCalendar() {
    this.router.navigate(['calendar']);
  }

  goShoppingLists() {
    this.router.navigate(['shopping-list']);
  }

  goPrepLists() {
    this.router.navigate(['prep-lists']);
  }

  goAddRecipy() {
    this.router.navigate(['cookster', 'recipies', 'edit-recipy'], {
      relativeTo: this.route,
    });
  }

  isDisplayNavTabs(): boolean {
    return Object.values(MainTabs).includes(this.currentRoute as MainTabs);
  }
}
