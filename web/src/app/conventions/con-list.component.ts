import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import StorageService from '../storage/storage.service';
import template from './con-list.component.html';
import styles from './con-list.component.scss';
import { Convention, Conventions } from '../../../../conartist';

@Component({
  selector: 'con-con-list',
  template: template,
  styles: [ styles ],
})
export default class ConListComponent {
  @Input() opened: Conventions;
  @Output() conClick = new EventEmitter<Convention>();

  private _conventions: Observable<Conventions>;

  constructor(@Inject(StorageService) storage: StorageService) {
    this._conventions = storage.conventions;
    this._conventions.take(1).subscribe(_ => _.forEach(_ => storage.fillConvention(_.code)));
  }

  get conventions() {
    return this._conventions;
  }
}
