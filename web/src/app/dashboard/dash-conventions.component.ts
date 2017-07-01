import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import template from './dash-conventions.component.html';
import styles from './dash-conventions.component.scss';
import StorageService from '../data/storage.service';
import ChooseConventionService from '../modals/choose-convention.service';

import { Conventions } from '../../../../conartist';

@Component({
  selector: 'con-dash-conventions',
  template: template,
  styles: [ styles ],
})
export default class DashConventionsComponent {
  private conventions: Observable<Conventions>;
  private keys: Observable<number>;

  constructor(@Inject(StorageService) storage: StorageService, @Inject(ChooseConventionService) private chooseConvention: ChooseConventionService) {
    this.conventions = storage.conventions;
    this.keys = storage.keys;
  }

  get currentConventions(): Observable<Conventions> {
    return this.conventions.map(_ => _.filter(({ start, end }) => start <= new Date() && new Date() <= end));
  }
  get upcomingConventions(): Observable<Conventions> {
    return this.conventions.map(_ => _.filter(({ start }) => start > new Date()));
  }
  get previousConventions(): Observable<Conventions> {
    return this.conventions.map(_ => _.filter(({ end }) => end < new Date()));
  }

  viewCon(code: string): void {
    // TODO: Navigate to convention details
    console.log(code);
  }

  openBuyKeys() {
    // TODO: allow purchasing of keys
    console.log("buying a key!");
  }

  openAddConventions() {
    this.chooseConvention.open().subscribe(console.log);
  }
}
