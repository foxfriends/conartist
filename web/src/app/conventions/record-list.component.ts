import { Component, Input } from '@angular/core';

import template from './record-list.component.html';
import styles from './record-list.component.scss';
import { ConventionData } from '../../../../conartist';

@Component({
  selector: 'con-record-list',
  template: template,
  styles: [ styles ],
})
export default class RecordListComponent {
  @Input() data: ConventionData;
}
