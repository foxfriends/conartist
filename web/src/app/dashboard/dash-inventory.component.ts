import { Component, Input } from '@angular/core';

import template from './dash-inventory.component.html';
import styles from './dash-inventory.component.scss';

@Component({
  selector: 'con-dash-inventory',
  template: template,
  styles: [ styles ],
})
export class DashInventoryComponent {
  @Input() products: ca.Products;
  @Input() types: ca.ProductTypes;
}
