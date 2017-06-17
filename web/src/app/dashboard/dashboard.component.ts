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
  info: UserInfo;
  constructor(@Inject(APIService) private api: APIService) {}
  async ngOnInit() {
    this.info = await this.api.getUserInfo();
    console.log(this.info);
  }
}
