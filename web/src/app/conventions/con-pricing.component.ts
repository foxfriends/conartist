import { Component, Input } from '@angular/core';

import template from './con-pricing.component.html';
import styles from './con-pricing.component.scss';
import { ConventionData } from '../../../../conartist';

@Component({
  selector: 'con-con-pricing',
  template: template,
  styles: [ styles ],
})
export default class ConPricingComponent {
  @Input() data: ConventionData;
}
