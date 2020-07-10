import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent  implements OnInit, OnDestroy {

  title = 'AbeeMap';
  userId = '';

  isHandset: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isHandset$.subscribe( (isHandset) => {
      this.isHandset = isHandset;
    });
  }

  ngOnInit() {
    this.authService.loggedIn$.subscribe( loggedIn => {
      if (loggedIn) {
        this.userId = this.authService.userId;
      } else {
        this.userId = '';
      }
    });
  }

  ngOnDestroy() {
    this.authService.loggedIn$.unsubscribe();
  }

  sidenavClose(sidenav) {
    if (this.isHandset) {
      sidenav.close();
    }
  }

  login(): void {
    // this.authService.login(window.location.href);
    this.authService.login();
  }

  logout(): void {
    this.authService.deleteSession();
    // window.location.href = window.location.href;
    // this.authService.login(window.location.href);
    this.authService.login();
  }

}
