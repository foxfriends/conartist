import { Component, Input, Inject } from '@angular/core';

import StorageService from '../data/storage.service';
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
  saving = false;
  constructor(@Inject(StorageService) private storage: StorageService) {}

  async saveConvention() {
    this.saving = true;
    await this.storage.commit();
    this.saving = false;
  }
}
