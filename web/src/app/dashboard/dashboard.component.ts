import { Component, OnInit, Inject } from '@angular/core';

import APIService from '../api/api.service';
import template from './dashboard.component.html';
import styles from './dashboard.component.scss';
import { UserInfo } from '../../../../conartist';

@Component({
  selector: 'con-dashboard',
  template: template,
  styles: [ styles ],
})
export default class DashboardComponent implements OnInit {
  info: UserInfo = {
    email: '', keys: 0, products: {}, prices: {}, types: {}, conventions: [],
  };
  constructor(@Inject(APIService) private api: APIService) {}

  async ngOnInit() {
    this.info = await this.api.getUserInfo().toPromise();
    this.info.conventions = [
      {
        title: 'Anime North 2017',
        code: 'abc',
        start: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Anime North 2018',
        code: 'abc',
        start: new Date(),
        end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Anime North 2019',
        code: 'abc',
        start: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Anime North 2020',
        code: 'abc',
        start: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        end: new Date(Date.now() + 53 * 24 * 60 * 60 * 1000),
      },
    ];
    this.info.conventions = this.info.conventions.sort(({ start: a }, { start: b }) => a.getTime() - b.getTime());
  }
}
