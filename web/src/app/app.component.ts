import { Component } from '@angular/core';

import template from './app.component.html';
import styles from './app.component.scss';

@Component({
  selector: 'con-artist',
  template: template,
  styles: [ styles ],
})
export default class AppComponent {
  title = 'Con Artist';
}
