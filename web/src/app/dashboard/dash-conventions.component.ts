import { Component, Input } from '@angular/core';
import * as moment from 'moment';

import template from './dash-conventions.component.html';
import styles from './dash-conventions.component.scss';
import { Convention } from '../../../../conartist';

@Component({
  selector: 'con-dash-conventions',
  template: template,
  styles: [ styles ],
})
export default class DashConventionsComponent {
  @Input() conventions: Convention[];
  @Input() keys: number;

  get currentConventions(): Convention[] {
    return this.conventions.filter(({ start, end }) => start <= new Date() && new Date() <= end);
  }
  get upcomingConventions(): Convention[] {
    return this.conventions.filter(({ start   }) => start > new Date());
  }
  get previousConventions(): Convention[] {
    return this.conventions.filter(({ end }) => end < new Date()).reverse();
  }

  viewCon(code: string): void {
    // TODO: Navigate to convention details
    console.log(code);
  }

  formatDate(date: Date): string {
    return moment(date).format("MMM D, YYYY");
  }

  openBuyKeys() {
    // TODO: allow purchasing of keys
    console.log("buying a key!");
  }

  openAddConventions() {
    // TODO: allow selecting conventions
    console.log("adding a convention!");
  }
}
