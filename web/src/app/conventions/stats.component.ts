import { Component, Input } from '@angular/core';

import template from './stats.component.html';
import styles from './stats.component.scss';

@Component({
  selector: 'con-stats',
  template: template,
  styles: [ styles ],
})
export class StatsComponent {
  @Input() con: ca.FullConvention;
}
