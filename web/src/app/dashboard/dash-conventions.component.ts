import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import template from './dash-conventions.component.html';
import styles from './dash-conventions.component.scss';
import StorageService from '../data/storage.service';
import ChooseConventionService from '../modals/choose-convention.service';
import ErrorService from '../modals/error.service';

import { MetaConvention, FullConvention, Conventions } from '../../../../conartist';

@Component({
  selector: 'con-dash-conventions',
  template: template,
  styles: [ styles ],
})
export default class DashConventionsComponent {
  private _conventions: BehaviorSubject<Conventions>;
  private keys: BehaviorSubject<number>;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ChooseConventionService) private chooseConvention: ChooseConventionService,
    @Inject(ErrorService) private error: ErrorService,
  ) {
    this._conventions = this.storage.conventions;
    this.keys = this.storage.keys;
  }

  get conventions(): (MetaConvention | FullConvention)[] {
    return this._conventions.getValue().filter((_): _ is MetaConvention | FullConvention => _.type !== 'invalid');
  }

  get currentConventions(): (MetaConvention | FullConvention)[] {
    return this.conventions.filter(({ start, end }) => start <= new Date() && new Date() <= end);
  }
  get upcomingConventions(): (MetaConvention | FullConvention)[] {
    return this.conventions.filter(({ start }) => start > new Date());
  }
  get previousConventions(): (MetaConvention | FullConvention)[] {
    return this.conventions.filter(({ end }) => end < new Date());
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
    this.chooseConvention.open().filter((_): _ is MetaConvention => !!_).subscribe(_ => {
      try {
        this.storage.addConvention(_);
      } catch(error) {
        console.error(error);
        this.error.open(error);
        return;
      }
      this.storage.commit(true);
    });
  }
}
