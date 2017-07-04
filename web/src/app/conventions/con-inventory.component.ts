import { Component, Input } from '@angular/core';

import template from './con-inventory.component.html';
import styles from './con-inventory.component.scss';
import { ConventionData } from '../../../../conartist';

@Component({
  selector: 'con-con-inventory',
  template: template,
  styles: [ styles ],
})
export default class ConInventoryComponent {
  @Input() data: ConventionData;
}
