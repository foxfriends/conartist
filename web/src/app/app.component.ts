import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import StorageService from './data/storage.service';
import HelpService from './help/help.service';
import SaveService from './data/save.service';
import template from './app.component.html';
import styles from './app.component.scss';

@Component({
  selector: 'con-artist',
  template: template,
  styles: [ styles ],
})
export default class AppComponent {
  signedIn = false;

  constructor(
    @Inject(HelpService) public help: HelpService,
    @Inject(SaveService) public save: SaveService,
    @Inject(Router) private router: Router,
    @Inject(StorageService) private storage: StorageService,
  ) {
    this.router.events
      .filter((_): _ is NavigationEnd => _ instanceof NavigationEnd)
      .subscribe(_ => this.signedIn = _.urlAfterRedirects !== '/sign-in')
  }

  signOut() {
    localStorage.removeItem('authtoken');
    this.router.navigate(['/sign-in']);
    this.storage.reset();
  }
}
