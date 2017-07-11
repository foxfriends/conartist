import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import ConDataSource from '../data/data-source';
import template from './record-list.component.html';
import styles from './record-list.component.scss';
import { FullConvention, Record } from '../../../../conartist';

@Component({
  selector: 'con-record-list',
  template: template,
  styles: [ styles ],
})
export default class RecordListComponent implements OnInit {
  @Input() con: Observable<FullConvention>;
  dataSource: ConDataSource<Record>;

  ngOnInit() {
    this.dataSource = new ConDataSource(this.con.map(_ => _.data.records));
  }
}
