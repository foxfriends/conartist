import { Component, Input } from '@angular/core';

import template from './dash-inventory.component.html';
import styles from './dash-inventory.component.scss';
import { Products, ProductTypes } from '../../../../conartist';

@Component({
  selector: 'con-dash-inventory',
  template: template,
  styles: [ styles ],
})
export default class DashConventionsComponent {
  @Input() products: Products;
  @Input() types: ProductTypes;
}
