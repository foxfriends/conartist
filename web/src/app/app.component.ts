import { Component } from '@angular/core';
import { MdSidenav } from '@angular/material';

import template from './app.component.html';
import styles from './app.component.scss';

@Component({
  selector: 'con-artist',
  template: template,
  styles: [ styles ],
})
export default class AppComponent {
  sidenav: MdSidenav;
}
