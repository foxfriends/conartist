import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import template from './conventions.component.html';
import styles from './conventions.component.scss';
import StorageService from '../data/storage.service';
import ChooseConventionService from '../modals/choose-convention.service';
import ErrorService from '../modals/error.service';
import { Convention, MetaConvention, Conventions } from '../../../../conartist';

@Component({
  selector: 'con-conventions',
  template: template,
  styles: [ styles ],
})
export default class ConventionsComponent {
  private _conventions: BehaviorSubject<Conventions>;
  openConventions: Conventions = [];
  currentTab = 0;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ChooseConventionService) private chooseConvention: ChooseConventionService,
    @Inject(ErrorService) private error: ErrorService,
  ) {
    this._conventions = storage.conventions;
  }

  get conventions() {
    return this._conventions.getValue();
  }

  openConvention(convention: Convention) {
    if(!this.openConventions.includes(convention)) {
      this.openConventions.push(convention);
    }
    this.currentTab = this.openConventions.indexOf(convention) + 1;
  }

  closeConvention(convention: Convention) {
    this.openConventions = this.openConventions.filter(_ => _ !== convention);
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
