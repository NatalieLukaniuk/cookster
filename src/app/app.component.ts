import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { initializeApp } from 'firebase/app';

import { AuthService } from './auth/services/auth.service';
import { UserService } from './auth/services/user.service';
import { RecipiesService } from './recipies/services/recipies.service';
import { LayoutService } from './shared/services/layout.service';
import { GetRecipiesAction } from './store/actions/recipies.actions';
import * as UiActions from './store/actions/ui.actions';
import { IAppState } from './store/reducers';
import { getIsError, getIsSidebarOpen, getIsSuccessMessage } from './store/selectors/ui.selectors';

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
    storageBucket: 'cookster-12ac8PROJECT_ID.appspot.com',
    messagingSenderId: '755799855022',
    appId: '1:755799855022:web:506cb5221a72eff4cf023f',
  };

  @ViewChild('drawer')
  sidebar!: MatDrawer;

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
  }
  ngAfterViewInit(): void {
    this.sidebar.openedChange.subscribe(isOpen => {
      if (!isOpen) {
        this.store.dispatch(new UiActions.SetIsSidebarOpenAction(false))
      }
    })
    this.store.pipe(select(getIsSidebarOpen)).subscribe(isOpen => {
      if (isOpen) {
        this.sidebar.open()
      }

    })
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
    this.store.dispatch(new GetRecipiesAction())

    this.store.pipe(select(getIsError)).subscribe(error => {
      if (!!error) {
        this._snackBar.open(error, 'Ok', {
          duration: 3000
        });
        this.store.dispatch(new UiActions.ResetErrorAction())
      }

    })
    this.store.pipe(select(getIsSuccessMessage)).subscribe(message => {
      if (message) {
        this._snackBar.open(message, 'Ok', {
          duration: 3000
        });
        this.store.dispatch(new UiActions.DismissSuccessMessageAction())
      }

    })
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
  }
}
