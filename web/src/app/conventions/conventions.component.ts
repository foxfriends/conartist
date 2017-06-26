import { Component } from '@angular/core';

import template from './conventions.component.html';
import styles from './conventions.component.scss';
import { Convention, Conventions } from '../../../../conartist';

@Component({
  selector: 'con-conventions',
  template: template,
  styles: [ styles ],
})
export default class ConventionsComponent {
  openConventions: Conventions = [];
  currentTab = 0;

  openConvention(convention: Convention) {
    if(!this.openConventions.includes(convention)) {
      this.openConventions.push(convention);
    }
    this.currentTab = this.openConventions.indexOf(convention) + 1;
  }

  closeConvention(convention: Convention) {
    this.openConventions = this.openConventions.filter(_ => _ !== convention);
  }
}
