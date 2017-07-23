import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import template from './choose-convention.component.html';
import styles from './choose-convention.component.scss';
import { APIService } from '../api/api.service';
import { ConDataSource } from '../data/data-source';

type ColumnName = 'name' | 'code' | 'start' | 'end' | 'choose';
@Component({
  selector: 'con-choose-convention',
  template: template,
  styles: [ styles ],
})
export class ChooseConventionComponent {
  readonly pageSize = 5;

  private _conventions = new BehaviorSubject<ca.MetaConvention[]>([]);
  readonly displayedColumns: ColumnName[] = ['name', 'code',  'start', 'end', 'choose'];
  conCount = 0;

  dataSource = new ConDataSource(this._conventions, null, null, { size: this.pageSize, index: 0 });
  constructor(@Inject(APIService) private api: APIService) {
    this.api.getConventions().subscribe(_ => {
      this.conCount = _.length;
      this._conventions.next(_);
    });
  }

  get page() {
    return this.dataSource.page ? this.dataSource.page.index : 0;
  }
  set page(index) {
    this.dataSource.page = { size: this.pageSize, index };
  }
}
