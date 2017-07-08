import { Component, Inject } from '@angular/core';
import { MdSidenav } from '@angular/material';

import HelpService from './help/help.service';
import template from './app.component.html';
import styles from './app.component.scss';

@Component({
  selector: 'con-artist',
  template: template,
  styles: [ styles ],
})
export default class AppComponent {
  sidenav: MdSidenav;
  constructor(@Inject(HelpService) public help: HelpService) {}
}
