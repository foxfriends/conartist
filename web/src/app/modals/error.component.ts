import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

import template from './error.component.html';
import styles from './error.component.scss';

@Component({
  selector: 'con-error',
  template: template,
  styles: [ styles ],
})
export class ErrorComponent {
  constructor(@Inject(MD_DIALOG_DATA) public error: Error) { }
}
