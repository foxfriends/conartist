import { Component, Input } from '@angular/core';

import template from './con-info.component.html';
import styles from './con-info.component.scss';
import { FullConvention } from '../../../../conartist';

@Component({
  selector: 'con-con-info',
  template: template,
  styles: [ styles ],
})
export default class ConInfoComponent {
  @Input() convention: FullConvention;
}
