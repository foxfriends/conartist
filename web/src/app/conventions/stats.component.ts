import { Component, Input } from '@angular/core';

import template from './stats.component.html';
import styles from './stats.component.scss';
import { FullConvention } from '../../../../conartist';

@Component({
  selector: 'con-stats',
  template: template,
  styles: [ styles ],
})
export default class StatsComponent {
  @Input() con: FullConvention;
}
