import { Component, Input } from '@angular/core';

import template from './product-list.component.html';
import styles from './product-list.component.scss';
import { Products } from '../../../../conartist';

@Component({
  selector: 'con-product-list',
  template: template,
  styles: [ styles ],
})
export default class ProductListComponent {
  @Input() products: Products;
}
