import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import StorageService from '../data/storage.service';
import template from './con-list.component.html';
import styles from './con-list.component.scss';
import { Convention, Conventions, MetaConvention, FullConvention } from '../../../../conartist';

@Component({
  selector: 'con-con-list',
  template: template,
  styles: [ styles ],
})
export default class ConListComponent {
  @Input() opened: Conventions;
  @Output() conClick = new EventEmitter<Convention>();

  private _conventions: Observable<(MetaConvention | FullConvention)[]>;

  constructor(@Inject(StorageService) storage: StorageService) {
    this._conventions = storage.conventions.map(
      _ => _.filter((_): _ is MetaConvention | FullConvention => _.type !== 'invalid')
    );
    this._conventions.subscribe(_ => _.forEach(_ => storage.fillConvention(_.code)));
    this._conventions.subscribe(console.table);
  }

  get conventions() {
    return this._conventions;
  }
}
